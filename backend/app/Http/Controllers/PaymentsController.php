<?php

namespace App\Http\Controllers;

use App\Models\PatientBill;
use App\Models\BillItem;
use App\Models\BillPayment;
use App\Models\Patient;
use App\Models\PatientCharge;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class PaymentsController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index(Request $request, $birthcare_id)
    {
        try {
            $query = PatientBill::with(['patient', 'creator', 'items', 'payments'])
                ->forBirthcare($birthcare_id)
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('patient_id') && $request->patient_id) {
                $query->where('patient_id', $request->patient_id);
            }

            if ($request->has('date_from') && $request->date_from) {
                $query->whereDate('bill_date', '>=', $request->date_from);
            }

            if ($request->has('date_to') && $request->date_to) {
                $query->whereDate('bill_date', '<=', $request->date_to);
            }

            $bills = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $bills,
                'summary' => $this->getPaymentsSummary($birthcare_id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request, $birthcare_id)
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,id',
                'bill_date' => 'required|date',
                'due_date' => 'required|date|after_or_equal:bill_date',
                'tax_amount' => 'numeric|min:0',
                'discount_amount' => 'numeric|min:0',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.patient_charge_id' => 'nullable|exists:patient_charges,id',
                'items.*.service_name' => 'required|string|max:255',
                'items.*.description' => 'nullable|string',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Create the bill
            $bill = PatientBill::create([
                'birthcare_id' => $birthcare_id,
                'patient_id' => $validated['patient_id'],
                'bill_number' => PatientBill::generateBillNumber(),
                'bill_date' => $validated['bill_date'],
                'due_date' => $validated['due_date'],
                'tax_amount' => $validated['tax_amount'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'subtotal' => 0,
                'total_amount' => 0,
                'paid_amount' => 0,
                'balance_amount' => 0,
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            // Create bill items
            foreach ($validated['items'] as $itemData) {
                BillItem::create([
                    'patient_bill_id' => $bill->id,
                    'patient_charge_id' => $itemData['patient_charge_id'],
                    'service_name' => $itemData['service_name'],
                    'description' => $itemData['description'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                ]);
            }

            // Calculate totals
            $bill->load('items');
            $bill->calculateTotals();
            $bill->save();

            DB::commit();

            $bill->load(['patient', 'creator', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $bill,
                'message' => 'Payment created successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified payment.
     */
    public function show($birthcare_id, $bill_id)
    {
        try {
            $bill = PatientBill::with(['patient', 'creator', 'items.patientCharge', 'payments.receiver'])
                ->forBirthcare($birthcare_id)
                ->findOrFail($bill_id);

            return response()->json([
                'success' => true,
                'data' => $bill
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified payment.
     */
    public function update(Request $request, $birthcare_id, $bill_id)
    {
        try {
            $bill = PatientBill::forBirthcare($birthcare_id)->findOrFail($bill_id);

            // Only allow editing draft payments
            if ($bill->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft payments can be edited'
                ], 422);
            }

            $validated = $request->validate([
                'bill_date' => 'required|date',
                'due_date' => 'required|date|after_or_equal:bill_date',
                'tax_amount' => 'numeric|min:0',
                'discount_amount' => 'numeric|min:0',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.patient_charge_id' => 'nullable|exists:patient_charges,id',
                'items.*.service_name' => 'required|string|max:255',
                'items.*.description' => 'nullable|string',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Update bill
            $bill->update([
                'bill_date' => $validated['bill_date'],
                'due_date' => $validated['due_date'],
                'tax_amount' => $validated['tax_amount'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'notes' => $validated['notes'],
            ]);

            // Delete existing items
            $bill->items()->delete();

            // Create new items
            foreach ($validated['items'] as $itemData) {
                BillItem::create([
                    'patient_bill_id' => $bill->id,
                    'patient_charge_id' => $itemData['patient_charge_id'],
                    'service_name' => $itemData['service_name'],
                    'description' => $itemData['description'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                ]);
            }

            // Recalculate totals
            $bill->load('items');
            $bill->calculateTotals();
            $bill->save();

            DB::commit();

            $bill->load(['patient', 'creator', 'items', 'payments']);

            return response()->json([
                'success' => true,
                'data' => $bill,
                'message' => 'Payment updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified payment.
     */
    public function destroy($birthcare_id, $bill_id)
    {
        try {
            $bill = PatientBill::forBirthcare($birthcare_id)->findOrFail($bill_id);

            // Only allow deleting draft payments
            if ($bill->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft payments can be deleted'
                ], 422);
            }

            $bill->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment status.
     */
    public function updateStatus(Request $request, $birthcare_id, $bill_id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:draft,sent,cancelled'
            ]);

            $bill = PatientBill::forBirthcare($birthcare_id)->findOrFail($bill_id);

            $bill->update(['status' => $validated['status']]);

            return response()->json([
                'success' => true,
                'data' => $bill,
                'message' => 'Payment status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add payment to a payment.
     */
    public function addPayment(Request $request, $birthcare_id, $bill_id)
    {
        try {
            $bill = PatientBill::forBirthcare($birthcare_id)->findOrFail($bill_id);

            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01|max:' . $bill->balance_amount,
                'payment_date' => 'required|date',
                'payment_method' => 'required|in:cash,credit_card,debit_card,bank_transfer,check,insurance',
                'reference_number' => 'nullable|string|max:255',
                'notes' => 'nullable|string'
            ]);

            DB::beginTransaction();

            $payment = BillPayment::create([
                'patient_bill_id' => $bill->id,
                'payment_number' => BillPayment::generatePaymentNumber(),
                'payment_date' => $validated['payment_date'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'notes' => $validated['notes'],
                'received_by' => Auth::id(),
            ]);

            // Update bill payment status
            $bill->updatePaymentStatus();

            DB::commit();

            $payment->load('receiver');

            return response()->json([
                'success' => true,
                'data' => $payment,
                'bill' => $bill->fresh(['payments']),
                'message' => 'Payment added successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payments dashboard data.
     */
    public function dashboard($birthcare_id)
    {
        try {
            $summary = $this->getPaymentsSummary($birthcare_id);
            $recentBills = PatientBill::with(['patient'])
                ->forBirthcare($birthcare_id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            $overdueCount = PatientBill::forBirthcare($birthcare_id)
                ->overdue()
                ->count();

            // Monthly revenue chart data
            $monthlyRevenue = PatientBill::forBirthcare($birthcare_id)
                ->where('status', 'paid')
                ->whereYear('bill_date', date('Y'))
                ->selectRaw('MONTH(bill_date) as month, SUM(total_amount) as revenue')
                ->groupBy('month')
                ->pluck('revenue', 'month');

            return response()->json([
                'success' => true,
                'data' => [
                    'summary' => $summary,
                    'recent_bills' => $recentBills,
                    'overdue_count' => $overdueCount,
                    'monthly_revenue' => $monthlyRevenue
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get patients for payments.
     */
    public function getPatients($birthcare_id)
    {
        try {
            $patients = Patient::where('birthcare_id', $birthcare_id)
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'phone']);

            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch patients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get patient charges.
     */
    public function getPatientCharges($birthcare_id)
    {
        try {
            $services = PatientCharge::where('birthcare_id', $birthcare_id)
                ->where('is_active', true)
                ->orderBy('service_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch patient charges',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payments summary.
     */
    private function getPaymentsSummary($birthcare_id)
    {
        $bills = PatientBill::forBirthcare($birthcare_id);

        return [
            'total_bills' => $bills->count(),
            'total_revenue' => $bills->sum('total_amount'),
            'total_paid' => $bills->sum('paid_amount'),
            'total_outstanding' => $bills->unpaid()->sum('balance_amount'),
            'overdue_amount' => $bills->overdue()->sum('balance_amount'),
            'bills_by_status' => $bills->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
        ];
    }
}
