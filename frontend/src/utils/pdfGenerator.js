import jsPDF from 'jspdf';

export const generatePrenatalFormPDF = (formData, patientData, birthCareInfo = null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Set font
  doc.setFont('helvetica');
  
  // Official Header - Republic of the Philippines
  let yPos = 25;
  
  // Republic of the Philippines
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  // City Government of Davao
  doc.setFontSize(13);
  doc.text('CITY GOVERNMENT OF DAVAO', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  // Medical Center Name - use birthcare info or fallback
  const facilityName = birthCareInfo?.name?.toUpperCase() || 'BIRTH CARE FACILITY';
  doc.setFontSize(11);
  doc.text(facilityName, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  // Address
  doc.setFontSize(9);
  const address = birthCareInfo?.description || 'Loading facility address...';
  doc.text(address, pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;
  
  // Title border and form name
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(30, yPos, pageWidth - 30, yPos);
  yPos += 8;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('PRENATAL EXAMINATION FORM', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  doc.line(30, yPos, pageWidth - 30, yPos);
  yPos += 20;
  
  // Patient Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Patient Information', 20, yPos);
  yPos += 12;
  
  doc.setFontSize(10);
  
  if (patientData) {
    const fullName = `${patientData.first_name} ${patientData.middle_name || ''} ${patientData.last_name}`.trim();
    doc.text(`Name: ${fullName}`, 20, yPos);
    yPos += 5;
    doc.text(`Date of Birth: ${patientData.date_of_birth || 'N/A'}`, 20, yPos);
    yPos += 5;
    doc.text(`Age: ${patientData.age || 'N/A'}`, 20, yPos);
    yPos += 5;
    doc.text(`Contact: ${patientData.contact_number || 'N/A'}`, 20, yPos);
    yPos += 5;
    doc.text(`Address: ${patientData.address || 'N/A'}`, 20, yPos);
    yPos += 12;
  }
  
  // Examination Details Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Examination Details', 20, yPos);
  yPos += 12;
  
  doc.setFontSize(10);
  doc.text(`Examination Date: ${formData.form_date}`, 20, yPos);
  yPos += 5;
  doc.text(`Gestational Age: ${formData.gestational_age || 'N/A'}`, 20, yPos);
  yPos += 5;
  doc.text(`Weight: ${formData.weight || 'N/A'}`, 20, yPos);
  yPos += 5;
  doc.text(`Blood Pressure: ${formData.blood_pressure || 'N/A'}`, 20, yPos);
  yPos += 5;
  doc.text(`Next Appointment: ${formData.next_appointment || 'N/A'}`, 20, yPos);
  yPos += 5;
  doc.text(`Examined By: ${formData.examined_by || 'N/A'}`, 20, yPos);
  yPos += 12;
  
  // Clinical Notes Section
  if (formData.notes) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Clinical Notes & Observations', 20, yPos);
    yPos += 12;
    
    doc.setFontSize(10);
    // Split long text into multiple lines
    const splitNotes = doc.splitTextToSize(formData.notes, 170);
    doc.text(splitNotes, 20, yPos);
    yPos += splitNotes.length * 4 + 10;
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
  const facilityFooterName = birthCareInfo?.name || 'Birth Care Facility';
  doc.text(facilityFooterName, 20, 285);
  
  return doc;
};

export const savePrenatalFormAsPDF = async (formData, patientData, birthcare_Id, birthCareInfo = null) => {
  try {
    const doc = generatePrenatalFormPDF(formData, patientData, birthCareInfo);
    const pdfBlob = doc.output('blob');
    
    // Convert blob to base64
    const base64PDF = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        resolve(base64);
      };
      reader.readAsDataURL(pdfBlob);
    });
    
    // Generate title
    const patientName = `${patientData.first_name}_${patientData.last_name}`;
    const title = `Prenatal_Form_${patientName}_${formData.form_date}`;
    
    return {
      base64PDF,
      title,
      document_type: 'prenatal_form',
      metadata: {
        form_date: formData.form_date,
        gestational_age: formData.gestational_age,
        weight: formData.weight,
        blood_pressure: formData.blood_pressure,
        examined_by: formData.examined_by,
        generated_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadPrenatalFormPDF = (formData, patientData, birthCareInfo = null) => {
  try {
    const doc = generatePrenatalFormPDF(formData, patientData, birthCareInfo);
    const patientName = `${patientData.first_name}_${patientData.last_name}`;
    const filename = `Prenatal_Form_${patientName}_${formData.form_date}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('PDF download failed:', error);
    throw new Error('Failed to download PDF');
  }
};

// Labor Monitoring PDF Generator
export const generateLaborMonitoringPDF = (patientData, monitoringEntries, additionalInfo, birthCareInfo = null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Set font
  doc.setFont('helvetica');
  
  // Official Header - Republic of the Philippines
  let yPos = 25;
  
  // Republic of the Philippines
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  // City Government of Davao
  doc.setFontSize(13);
  doc.text('CITY GOVERNMENT OF DAVAO', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  // Medical Center Name - use birthcare info or fallback
  const facilityName = birthCareInfo?.name?.toUpperCase() || 'BIRTH CARE FACILITY';
  doc.setFontSize(11);
  doc.text(facilityName, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  // Address
  doc.setFontSize(9);
  const address = birthCareInfo?.description || 'Loading facility address...';
  doc.text(address, pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;
  
  // Title border and form name
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(30, yPos, pageWidth - 30, yPos);
  yPos += 8;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('LABOR MONITORING SHEET', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  doc.line(30, yPos, pageWidth - 30, yPos);
  yPos += 15;
  
  // Patient Information Section
  doc.setFontSize(10);
  if (patientData) {
    const fullName = `${patientData.first_name} ${patientData.middle_name || ''} ${patientData.last_name}`.trim();
    doc.text(`Name: ${fullName}`, 20, yPos);
    yPos += 5;
    
    // Additional info in two columns
    doc.text(`Date of Admission: ${additionalInfo?.admission_date || 'N/A'}`, 20, yPos);
    doc.text(`Case No: ${additionalInfo?.case_no || 'N/A'}`, 110, yPos);
    yPos += 5;
    
    doc.text(`Bed No: ${additionalInfo?.bed_no || 'N/A'}`, 20, yPos);
    yPos += 10;
  }
  
  // Monitoring Table
  const tableStartY = yPos;
  const colWidths = [25, 20, 20, 20, 20, 25, 40];
  const colStartX = [20, 45, 65, 85, 105, 125, 150];
  const headers = ['DATE', 'TIME', 'TEMP', 'PULSE', 'RESP', 'BP', 'FHT/LOCATION'];
  
  // Table headers
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  // Draw header row
  for (let i = 0; i < headers.length; i++) {
    doc.rect(colStartX[i], yPos, colWidths[i], 8);
    doc.text(headers[i], colStartX[i] + colWidths[i] / 2, yPos + 5, { align: 'center' });
  }
  yPos += 8;
  
  // Table data rows
  const maxRows = 20;
  const rowHeight = 6;
  
  for (let i = 0; i < maxRows; i++) {
    const entry = monitoringEntries[i];
    
    for (let j = 0; j < colWidths.length; j++) {
      doc.rect(colStartX[j], yPos, colWidths[j], rowHeight);
    }
    
    if (entry) {
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
        } catch (e) {
          return dateStr;
        }
      };
      
      const formatTime = (timeStr) => {
        if (!timeStr) return '';
        try {
          if (timeStr.includes('T')) {
            const date = new Date(timeStr);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
          return timeStr.split(':').slice(0, 2).join(':');
        } catch (e) {
          return timeStr;
        }
      };
      
      const data = [
        formatDate(entry.monitoring_date),
        formatTime(entry.monitoring_time),
        entry.temperature || '',
        entry.pulse || '',
        entry.respiration || '',
        entry.blood_pressure || '',
        entry.fht_location || ''
      ];
      
      for (let j = 0; j < data.length; j++) {
        doc.text(String(data[j]), colStartX[j] + colWidths[j] / 2, yPos + 4, { align: 'center' });
      }
    }
    
    yPos += rowHeight;
  }
  
  // Signature section
  yPos += 15;
  doc.setFontSize(8);
  doc.text('____________________________________', pageWidth - 80, yPos);
  yPos += 8;
  const attendingPhysician = additionalInfo?.attending_physician || 'Attending Physician';
  doc.text(attendingPhysician, pageWidth - 80, yPos, { align: 'left' });
  yPos += 4;
  doc.text('Attending Physician', pageWidth - 80, yPos, { align: 'left' });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
  const facilityFooterName = birthCareInfo?.name || 'Birth Care Facility';
  doc.text(facilityFooterName, 20, 285);
  
  return doc;
};

export const saveLaborMonitoringAsPDF = async (patientData, monitoringEntries, additionalInfo, birthcare_Id, birthCareInfo = null) => {
  try {
    const doc = generateLaborMonitoringPDF(patientData, monitoringEntries, additionalInfo, birthCareInfo);
    const pdfBlob = doc.output('blob');
    
    // Convert blob to base64
    const base64PDF = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        resolve(base64);
      };
      reader.readAsDataURL(pdfBlob);
    });
    
    // Generate title
    const patientName = `${patientData.first_name}_${patientData.last_name}`;
    const title = `Labor_Monitoring_${patientName}_${new Date().toISOString().split('T')[0]}`;
    
    return {
      base64PDF,
      title,
      document_type: 'labor_monitoring',
      metadata: {
        patient_name: `${patientData.first_name} ${patientData.last_name}`,
        admission_date: additionalInfo?.admission_date,
        case_no: additionalInfo?.case_no,
        bed_no: additionalInfo?.bed_no,
        entries_count: monitoringEntries.length,
        generated_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Labor monitoring PDF generation failed:', error);
    throw new Error('Failed to generate labor monitoring PDF');
  }
};

export const downloadLaborMonitoringPDF = (patientData, monitoringEntries, additionalInfo, birthCareInfo = null) => {
  try {
    const doc = generateLaborMonitoringPDF(patientData, monitoringEntries, additionalInfo, birthCareInfo);
    const patientName = `${patientData.first_name}_${patientData.last_name}`;
    const filename = `Labor_Monitoring_${patientName}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Labor monitoring PDF download failed:', error);
    throw new Error('Failed to download labor monitoring PDF');
  }
};

/**
 * Generate a professional PDF for patient referral
 * @param {Object} referralData - The referral data object
 * @param {Array} patients - Array of patients to find patient details
 * @returns {jsPDF} - The generated PDF document
 */
export const generateReferralPDF = async (referralData, patients = []) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addWrappedText = (text, x, y, maxWidth, lineHeight = 7) => {
    if (!text) return y;
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header with logo placeholder and title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 80, 180);
  pdf.text('PATIENT REFERRAL FORM', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Referral ID and Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Referral ID: ${referralData.id || 'N/A'}`, margin, yPosition);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, yPosition);
  yPosition += 10;

  // Draw separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Patient Information Section
  const selectedPatient = patients.find(p => p.id == referralData.patient_id);
  if (selectedPatient) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 80, 180);
    pdf.text('PATIENT INFORMATION', margin, yPosition);
    yPosition += 8;
    
    // Patient details in a structured format
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const patientName = `${selectedPatient.first_name || ''} ${selectedPatient.middle_name || ''} ${selectedPatient.last_name || ''}`.trim();
    pdf.text(`Full Name: ${patientName}`, margin + 5, yPosition);
    yPosition += 6;
    
    if (selectedPatient.date_of_birth) {
      pdf.text(`Date of Birth: ${selectedPatient.date_of_birth}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    if (selectedPatient.gender) {
      pdf.text(`Gender: ${selectedPatient.gender}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    if (selectedPatient.phone_number) {
      pdf.text(`Phone: ${selectedPatient.phone_number}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    if (selectedPatient.address) {
      yPosition = addWrappedText(`Address: ${selectedPatient.address}`, margin + 5, yPosition, pageWidth - 2 * margin - 10, 6);
    }
    
    yPosition += 8;
  }

  checkNewPage();

  // Referral Details Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 80, 180);
  pdf.text('REFERRAL DETAILS', margin, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  // Create a grid for referral information
  const leftColumn = margin + 5;
  const rightColumn = pageWidth / 2 + 10;
  
  pdf.text(`Date: ${referralData.referral_date || 'Not specified'}`, leftColumn, yPosition);
  pdf.text(`Time: ${referralData.referral_time || 'Not specified'}`, rightColumn, yPosition);
  yPosition += 6;
  
  pdf.text(`Urgency Level: ${(referralData.urgency_level || 'routine').toUpperCase()}`, leftColumn, yPosition);
  pdf.text(`Status: ${(referralData.status || 'pending').toUpperCase()}`, rightColumn, yPosition);
  yPosition += 10;

  checkNewPage();

  // Facilities Information Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 80, 180);
  pdf.text('FACILITY INFORMATION', margin, yPosition);
  yPosition += 8;
  
  // Referring Facility
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('FROM (Referring Facility):', margin + 5, yPosition);
  yPosition += 6;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Facility: ${referralData.referring_facility || 'Not specified'}`, margin + 10, yPosition);
  yPosition += 5;
  pdf.text(`Physician: ${referralData.referring_physician || 'Not specified'}`, margin + 10, yPosition);
  yPosition += 5;
  
  if (referralData.referring_physician_contact) {
    yPosition = addWrappedText(`Contact: ${referralData.referring_physician_contact}`, margin + 10, yPosition, pageWidth - 2 * margin - 20, 5);
  }
  yPosition += 8;
  
  // Receiving Facility
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TO (Receiving Facility):', margin + 5, yPosition);
  yPosition += 6;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Facility: ${referralData.receiving_facility || 'Not specified'}`, margin + 10, yPosition);
  yPosition += 5;
  
  if (referralData.receiving_physician) {
    pdf.text(`Physician: ${referralData.receiving_physician}`, margin + 10, yPosition);
    yPosition += 5;
  }
  
  if (referralData.receiving_physician_contact) {
    yPosition = addWrappedText(`Contact: ${referralData.receiving_physician_contact}`, margin + 10, yPosition, pageWidth - 2 * margin - 20, 5);
  }
  yPosition += 10;

  checkNewPage();

  // Clinical Information Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 80, 180);
  pdf.text('CLINICAL INFORMATION', margin, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  if (referralData.reason_for_referral) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Reason for Referral:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.reason_for_referral, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  }
  
  if (referralData.clinical_summary) {
    checkNewPage(25);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Clinical Summary:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.clinical_summary, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  }
  
  if (referralData.current_diagnosis) {
    checkNewPage(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Current Diagnosis:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.current_diagnosis, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  }
  
  if (referralData.relevant_history) {
    checkNewPage(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Relevant Medical History:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.relevant_history, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  }
  
  if (referralData.current_medications) {
    checkNewPage(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Current Medications:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.current_medications, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  }
  
  if (referralData.allergies) {
    checkNewPage(15);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Allergies & Adverse Reactions:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.allergies, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
  }
  
  if (referralData.vital_signs) {
    checkNewPage(15);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Current Vital Signs:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.vital_signs, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 8;
  }

  // Test Results & Treatment Section
  if (referralData.laboratory_results || referralData.imaging_results || referralData.treatment_provided) {
    checkNewPage(25);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 80, 180);
    pdf.text('TEST RESULTS & TREATMENT', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    if (referralData.laboratory_results) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Laboratory Results:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(referralData.laboratory_results, margin + 5, yPosition, pageWidth - 2 * margin - 10);
      yPosition += 5;
    }
    
    if (referralData.imaging_results) {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Imaging Results:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(referralData.imaging_results, margin + 5, yPosition, pageWidth - 2 * margin - 10);
      yPosition += 5;
    }
    
    if (referralData.treatment_provided) {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Treatment Provided:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(referralData.treatment_provided, margin + 5, yPosition, pageWidth - 2 * margin - 10);
      yPosition += 8;
    }
  }

  // Transfer & Care Details Section
  checkNewPage(25);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 80, 180);
  pdf.text('TRANSFER & CARE DETAILS', margin, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  // Two column layout for transfer details
  pdf.text(`Patient Condition: ${referralData.patient_condition || 'Not specified'}`, leftColumn, yPosition);
  pdf.text(`Transportation: ${referralData.transportation_mode || 'ambulance'}`, rightColumn, yPosition);
  yPosition += 6;
  
  if (referralData.accompanies_patient) {
    pdf.text(`Accompanies Patient: ${referralData.accompanies_patient}`, leftColumn, yPosition);
    yPosition += 6;
  }
  
  if (referralData.equipment_required) {
    pdf.text(`Equipment Required: ${referralData.equipment_required}`, leftColumn, yPosition);
    yPosition += 6;
  }
  
  if (referralData.isolation_precautions) {
    pdf.text(`Isolation Precautions: ${referralData.isolation_precautions}`, leftColumn, yPosition);
    yPosition += 6;
  }
  
  if (referralData.anticipated_care_level) {
    pdf.text(`Anticipated Care Level: ${referralData.anticipated_care_level}`, leftColumn, yPosition);
    yPosition += 6;
  }
  
  if (referralData.special_instructions) {
    yPosition += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Special Instructions:', margin + 5, yPosition);
    yPosition += 5;
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(referralData.special_instructions, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 8;
  }

  // Contact Information Section
  if (referralData.family_contact_name || referralData.insurance_information) {
    checkNewPage(20);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 80, 180);
    pdf.text('CONTACT & INSURANCE INFORMATION', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    if (referralData.family_contact_name) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Emergency Contact:', margin + 5, yPosition);
      yPosition += 5;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${referralData.family_contact_name}`, margin + 10, yPosition);
      yPosition += 5;
      
      if (referralData.family_contact_phone) {
        pdf.text(`Phone: ${referralData.family_contact_phone}`, margin + 10, yPosition);
        yPosition += 5;
      }
      
      if (referralData.family_contact_relationship) {
        pdf.text(`Relationship: ${referralData.family_contact_relationship}`, margin + 10, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    }
    
    if (referralData.insurance_information) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Insurance Information:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(referralData.insurance_information, margin + 10, yPosition, pageWidth - 2 * margin - 20);
      yPosition += 8;
    }
  }

  // Additional Notes Section
  if (referralData.notes) {
    checkNewPage(20);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 80, 180);
    pdf.text('ADDITIONAL NOTES', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    yPosition = addWrappedText(referralData.notes, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 10;
  }

  // Footer with signatures section
  checkNewPage(40);
  
  yPosition = Math.max(yPosition, pageHeight - 60);
  
  // Draw separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;
  
  // Signature section
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 80, 180);
  pdf.text('SIGNATURES', margin, yPosition);
  yPosition += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  // Referring physician signature
  pdf.text('Referring Physician:', margin, yPosition);
  pdf.line(margin + 35, yPosition + 2, margin + 100, yPosition + 2);
  pdf.text('Date:', margin + 110, yPosition);
  pdf.line(margin + 125, yPosition + 2, margin + 170, yPosition + 2);
  yPosition += 15;
  
  // Receiving physician signature
  pdf.text('Receiving Physician:', margin, yPosition);
  pdf.line(margin + 40, yPosition + 2, margin + 100, yPosition + 2);
  pdf.text('Date:', margin + 110, yPosition);
  pdf.line(margin + 125, yPosition + 2, margin + 170, yPosition + 2);
  
  // Footer with generation details
  const currentDateTime = new Date().toLocaleString();
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on: ${currentDateTime}`, margin, pageHeight - 15);
  pdf.text('Birthcare Management System', margin, pageHeight - 10);
  pdf.text('This is a system-generated document', pageWidth - margin - 60, pageHeight - 10);
  
  return pdf;
};

/**
 * Download referral PDF with proper filename
 * @param {Object} referralData - The referral data
 * @param {Array} patients - Array of patients
 * @param {string} filename - Optional custom filename
 */
export const downloadReferralPDF = async (referralData, patients = [], filename = null) => {
  try {
    const pdf = await generateReferralPDF(referralData, patients);
    
    // Generate filename if not provided
    let pdfFilename = filename;
    if (!pdfFilename) {
      const selectedPatient = patients.find(p => p.id == referralData.patient_id);
      const patientName = selectedPatient 
        ? `${selectedPatient.first_name}_${selectedPatient.last_name}`.replace(/\s+/g, '_')
        : 'patient';
      const dateStr = new Date().toISOString().split('T')[0];
      pdfFilename = `referral_${patientName}_${dateStr}.pdf`;
    }
    
    pdf.save(pdfFilename);
    return true;
  } catch (error) {
    console.error('Error generating/downloading PDF:', error);
    throw error;
  }
};

/**
 * Save referral PDF as document to patient's file
 * @param {Object} referralData - The referral data
 * @param {Array} patients - Array of patients
 * @param {string} birthcare_Id - The birthcare facility ID
 * @returns {Object} - Document data for saving
 */
export const saveReferralPDFAsDocument = async (referralData, patients, birthcare_Id) => {
  try {
    const pdf = await generateReferralPDF(referralData, patients);
    const pdfBlob = pdf.output('blob');
    
    // Convert blob to base64
    const base64PDF = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        resolve(base64);
      };
      reader.readAsDataURL(pdfBlob);
    });
    
    // Get patient info for filename and metadata
    const selectedPatient = patients.find(p => p.id == referralData.patient_id);
    const patientName = selectedPatient 
      ? `${selectedPatient.first_name}_${selectedPatient.last_name}`
      : 'Unknown_Patient';
    
    const title = `Patient_Referral_${patientName}_${referralData.referral_date || new Date().toISOString().split('T')[0]}`;
    
    return {
      base64PDF,
      title,
      document_type: 'referral',
      metadata: {
        referral_id: referralData.id,
        patient_id: referralData.patient_id,
        referral_date: referralData.referral_date,
        urgency_level: referralData.urgency_level,
        referring_facility: referralData.referring_facility,
        receiving_facility: referralData.receiving_facility,
        status: referralData.status,
        generated_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('PDF generation for document storage failed:', error);
    throw new Error('Failed to generate referral PDF for document storage');
  }
};
