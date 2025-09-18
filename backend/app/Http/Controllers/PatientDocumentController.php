<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PatientDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PatientDocumentController extends Controller
{
    /**
     * Display a listing of patient documents.
     */
    public function index(Request $request, $birthcare_id): JsonResponse
    {
        $query = PatientDocument::with(['patient', 'createdBy'])
            ->where('birth_care_id', $birthcare_id);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%")
                  ->orWhereHas('patient', function ($patientQuery) use ($search) {
                      $patientQuery->where('first_name', 'like', "%{$search}%")
                                   ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->get('patient_id'));
        }

        if ($request->filled('document_type')) {
            $query->where('document_type', $request->get('document_type'));
        }

        $documents = $query->orderBy('created_at', 'desc')
                          ->paginate(15);

        return response()->json($documents);
    }

    /**
     * Store a newly created patient document.
     */
    public function store(Request $request, $birthcare_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB max
            'document_type' => 'required|string|max:100',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('patient-documents', $fileName, 'public');

            $document = PatientDocument::create([
                'patient_id' => $request->patient_id,
                'birth_care_id' => $birthcare_id,
                'title' => $request->title,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'document_type' => $request->document_type,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'metadata' => $request->metadata,
                'created_by' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document->load(['patient', 'createdBy'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified patient document.
     */
    public function show($birthcare_id, PatientDocument $document): JsonResponse
    {
        $document->load(['patient', 'createdBy']);
        return response()->json($document);
    }

    /**
     * Download the specified patient document.
     */
    public function download($birthcare_id, PatientDocument $document): BinaryFileResponse
    {
        // Try public disk first, then private disk for backwards compatibility
        if (Storage::disk('public')->exists($document->file_path)) {
            return Storage::disk('public')->download($document->file_path, $document->file_name);
        } elseif (Storage::exists($document->file_path)) {
            return Storage::download($document->file_path, $document->file_name);
        }
        
        abort(404, 'File not found');
    }

    /**
     * View the specified patient document in browser.
     */
    public function view($birthcare_id, PatientDocument $document)
    {
        // Try public disk first, then private disk for backwards compatibility
        if (Storage::disk('public')->exists($document->file_path)) {
            return Storage::disk('public')->response($document->file_path);
        } elseif (Storage::exists($document->file_path)) {
            return Storage::response($document->file_path);
        }
        
        abort(404, 'File not found');
    }

    /**
     * Remove the specified patient document.
     */
    public function destroy($birthcare_id, PatientDocument $document): JsonResponse
    {
        try {
            $document->delete();
            
            return response()->json([
                'message' => 'Document deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a document from form data (for PDF generation)
     */
    public function storeFromData(Request $request, $birthcare_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'title' => 'required|string|max:255',
            'document_type' => 'required|string|max:100',
            'content' => 'required|string', // PDF content or base64
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate filename
            $fileName = time() . '_' . str_replace(' ', '_', $request->title) . '.pdf';
            $filePath = 'patient-documents/' . $fileName;

            // Store the PDF content
            Storage::disk('public')->put($filePath, base64_decode($request->content));
            $fileSize = Storage::disk('public')->size($filePath);

            $document = PatientDocument::create([
                'patient_id' => $request->patient_id,
                'birth_care_id' => $birthcare_id,
                'title' => $request->title,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'document_type' => $request->document_type,
                'file_size' => $fileSize,
                'mime_type' => 'application/pdf',
                'metadata' => $request->metadata,
                'created_by' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'Document created successfully',
                'document' => $document->load(['patient', 'createdBy'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create document',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
