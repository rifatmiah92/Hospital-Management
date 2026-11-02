'use client';

import React, { useState, useEffect } from 'react';
import { CarePlusStore } from '@/lib/store';
import { TestOrder, TestReport, User } from '@/lib/types';
import { downloadTestReportPDF } from '@/lib/pdf-generator';
import { Microchip, Upload, CheckCircle2, Clock, Plus, Trash2, X, Download } from 'lucide-react';

export default function LabDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [reports, setReports] = useState<TestReport[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);

  // Form State
  const [summary, setSummary] = useState('');
  const [metrics, setMetrics] = useState<{ parameter: string; value: string; unit: string; referenceRange: string; status: 'normal' | 'abnormal' | 'critical' }[]>([
    { parameter: 'Serum Fasting Glucose', value: '98', unit: 'mg/dL', referenceRange: '70 - 100 mg/dL', status: 'normal' },
    { parameter: 'Total Cholesterol', value: '215', unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'abnormal' },
  ]);
  const [labNotes, setLabNotes] = useState('');

  const loadData = () => {
    const user = CarePlusStore.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setOrders(CarePlusStore.getTestOrders());
      setReports(CarePlusStore.getTestReports());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openUploadModal = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsUploadModalOpen(true);
  };

  const addMetricRow = () => {
    setMetrics([...metrics, { parameter: '', value: '', unit: '', referenceRange: '', status: 'normal' }]);
  };

  const removeMetricRow = (idx: number) => {
    setMetrics(metrics.filter((_, i) => i !== idx));
  };

  const handlePublishReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !currentUser) return;

    const newReport = CarePlusStore.createTestReport({
      testOrderId: selectedOrder.id,
      testName: selectedOrder.testName,
      patientId: selectedOrder.patientId,
      patientName: selectedOrder.patientName,
      uploadedBy: currentUser.name,
      summary: summary || 'Report generated and verified by central bio-lab technician.',
      metrics: metrics.filter(m => m.parameter.trim().length > 0),
      notes: labNotes,
    });

    setIsUploadModalOpen(false);
    downloadTestReportPDF(newReport);
    loadData();
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Test Orders</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Microchip className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Pending / Processing</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {orders.filter(o => o.status !== 'ready').length}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Completed & Uploaded</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {orders.filter(o => o.status === 'ready').length}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Test Orders Queue */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">BioLab Diagnostic Queue</h3>
            <p className="text-xs text-slate-500">Upload lab findings & notify patients automatically</p>
          </div>
          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
            {orders.length} Active Orders
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.map((order) => (
            <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-sm">{order.testName}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    {order.orderNo}
                  </span>
                </div>
                <p className="text-xs text-slate-600">Patient: <strong>{order.patientName}</strong></p>
                <p className="text-[11px] text-slate-400">Ordered: {order.orderedDate} • Category: {order.category}</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    order.status === 'ready'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'processing'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.status}
                </span>

                {order.status !== 'ready' ? (
                  <button
                    onClick={() => openUploadModal(order)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-2 rounded-xl shadow-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Findings</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const rep = reports.find(r => r.testOrderId === order.id) || reports[0];
                      if (rep) downloadTestReportPDF(rep);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-600" />
                    <span>View PDF</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Test Findings Modal - Responsive */}
      {isUploadModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5 shadow-2xl border border-slate-100">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">Upload BioLab Test Findings</h3>
                <p className="text-xs text-sky-700 font-semibold truncate max-w-xs sm:max-w-none">
                  Test: {selectedOrder.testName} (Patient: {selectedOrder.patientName})
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishReport} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Findings Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Enter high-level diagnostic interpretation..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Parameters Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Test Parameters & Measured Values</label>
                  <button
                    type="button"
                    onClick={addMetricRow}
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                {metrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Parameter Name"
                        value={m.parameter}
                        onChange={(e) => {
                          const updated = [...metrics];
                          updated[idx].parameter = e.target.value;
                          setMetrics(updated);
                        }}
                        className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:col-span-4 gap-2">
                      <input
                        type="text"
                        placeholder="Measured Value"
                        value={m.value}
                        onChange={(e) => {
                          const updated = [...metrics];
                          updated[idx].value = e.target.value;
                          setMetrics(updated);
                        }}
                        className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-sky-500"
                      />
                      <input
                        type="text"
                        placeholder="Unit (mg/dL)"
                        value={m.unit}
                        onChange={(e) => {
                          const updated = [...metrics];
                          updated[idx].unit = e.target.value;
                          setMetrics(updated);
                        }}
                        className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Ref Range (< 200)"
                        value={m.referenceRange}
                        onChange={(e) => {
                          const updated = [...metrics];
                          updated[idx].referenceRange = e.target.value;
                          setMetrics(updated);
                        }}
                        className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2">
                      <select
                        value={m.status}
                        onChange={(e) => {
                          const updated = [...metrics];
                          updated[idx].status = e.target.value as any;
                          setMetrics(updated);
                        }}
                        className="p-1.5 border rounded-lg text-[10px] font-bold bg-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="abnormal">Abnormal</option>
                        <option value="critical">Critical</option>
                      </select>
                      {metrics.length > 1 && (
                        <button type="button" onClick={() => removeMetricRow(idx)} className="text-rose-600 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish Report & Notify Patient</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
