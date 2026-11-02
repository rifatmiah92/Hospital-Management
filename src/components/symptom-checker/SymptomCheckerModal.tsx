'use client';

import React, { useState } from 'react';
import { Sparkles, X, HeartPulse, ChevronRight, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { CarePlusStore } from '@/lib/store';
import { Department, Doctor } from '@/lib/types';

interface SymptomCheckerModalProps {
  onClose: () => void;
  onBookDoctor: (doctorId: string) => void;
}

const COMMON_SYMPTOMS = [
  { id: 'chest_pain', label: 'Chest Pressure / Heart Palpitations', category: 'cardiology' },
  { id: 'high_bp', label: 'High Blood Pressure / Dizziness', category: 'cardiology' },
  { id: 'child_fever', label: 'Child Fever / Persistent Cough', category: 'pediatrics' },
  { id: 'pediatric_growth', label: 'Child Growth & Vaccination', category: 'pediatrics' },
  { id: 'severe_headache', label: 'Severe Migraine / Memory Issues', category: 'neurology' },
  { id: 'numbness', label: 'Limb Numbness / Seizure Symptoms', category: 'neurology' },
  { id: 'joint_pain', label: 'Joint Stiffness / Knee Pain', category: 'orthopedics' },
  { id: 'bone_injury', label: 'Bone Fracture / Muscle Injury', category: 'orthopedics' },
  { id: 'pregnancy', label: 'Pregnancy Care / Maternal Health', category: 'gynecology' },
  { id: 'skin_rash', label: 'Skin Rash / Eczema / Psoriasis', category: 'dermatology' },
];

export default function SymptomCheckerModal({ onClose, onBookDoctor }: SymptomCheckerModalProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [recommendedDepartment, setRecommendedDepartment] = useState<Department | null>(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;

    const categoryCounts: Record<string, number> = {};
    selectedSymptoms.forEach(symId => {
      const sym = COMMON_SYMPTOMS.find(s => s.id === symId);
      if (sym) {
        categoryCounts[sym.category] = (categoryCounts[sym.category] || 0) + 1;
      }
    });

    let topCategory = 'cardiology';
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    });

    const departments = CarePlusStore.getDepartments();
    const doctors = CarePlusStore.getDoctors();

    const matchedDept = departments.find(d => d.slug.includes(topCategory)) || departments[0];
    const matchedDocs = doctors.filter(doc => doc.departmentId === matchedDept.id || doc.departmentName.toLowerCase().includes(topCategory));

    setRecommendedDepartment(matchedDept);
    setRecommendedDoctors(matchedDocs.length > 0 ? matchedDocs : [doctors[0]]);
    setAnalyzed(true);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAnalyzed(false);
    setRecommendedDepartment(null);
    setRecommendedDoctors([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#0D0F14]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E7E4D9] flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#12151C] p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F2CB05]/20 text-[#F2CB05] flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg font-['Outfit']">AI Clinical Symptom Triage</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-['Inter']">Match specialist department & available consultants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {!analyzed ? (
            <>
              <div>
                <label className="block text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2 font-['Outfit']">
                  Select Symptoms You Are Experiencing:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {COMMON_SYMPTOMS.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym.id);
                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => toggleSymptom(sym.id)}
                        className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-[#F2CB05] bg-[#F2CB05]/20 text-[#12151C] shadow-sm font-bold ring-1 ring-[#F2CB05]'
                            : 'border-[#E7E4D9] bg-white text-[#12151C] hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate mr-2">{sym.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C9A400] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Emergency Disclaimer:</strong> For severe chest pressure, stroke symptoms, or severe trauma, call Emergency Hotline <strong>10666</strong> immediately.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              {/* Department Box */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F2F0E8] border border-[#E7E4D9]">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#C9A400] font-extrabold text-xs uppercase tracking-wider mb-1 font-['Outfit']">
                  <HeartPulse className="w-4 h-4 text-[#C9A400]" />
                  <span>Recommended Clinical Specialty</span>
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#12151C] font-['Outfit']">{recommendedDepartment?.name}</h4>
                <p className="text-xs text-[#5B5F66] mt-1 leading-relaxed">{recommendedDepartment?.description}</p>
              </div>

              {/* Recommended Doctors */}
              <div>
                <h5 className="text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2.5 sm:mb-3 font-['Outfit']">
                  Top Recommended Specialist Consultants:
                </h5>
                <div className="space-y-2.5 sm:space-y-3">
                  {recommendedDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E7E4D9] hover:border-[#F2CB05] bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-[#E7E4D9] shrink-0"
                        />
                        <div className="min-w-0">
                          <h6 className="font-bold text-[#12151C] text-sm font-['Outfit'] truncate">{doc.name}</h6>
                          <p className="text-xs text-[#C9A400] font-semibold truncate">{doc.designation}</p>
                          <p className="text-[10px] text-[#5B5F66] truncate">{doc.qualifications}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onBookDoctor(doc.id)}
                        className="btn-gold flex items-center justify-center gap-1 text-xs font-bold px-4 py-2 rounded-xl transition-all self-end sm:self-auto shadow-sm"
                      >
                        <span>Book ৳{doc.consultationFee}</span>
                        <ChevronRight className="w-4 h-4 text-[#0D0F14]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-[#F2F0E8] border-t border-[#E7E4D9] flex items-center justify-between">
          {!analyzed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#5B5F66] hover:text-[#12151C] px-2 py-1"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedSymptoms.length === 0}
                onClick={handleAnalyze}
                className="btn-gold flex items-center gap-1.5 sm:gap-2 text-xs font-bold disabled:opacity-50 px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D0F14]" />
                <span>Analyze & Recommend</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-bold text-[#5B5F66] hover:text-[#12151C] px-2 py-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Triage</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-[#12151C] bg-[#E7E4D9] hover:bg-[#F2F0E8] px-4 py-2 rounded-xl transition-all"
              >
                Close
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
