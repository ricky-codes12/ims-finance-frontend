import { useEffect, useState } from "react";
import api from "./services/api";
import { FaFileExcel } from "react-icons/fa";
import { FiAlertTriangle, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import Footer from "./components/Footer";

function App() {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [billing, setBilling] = useState(null);
  const [penalty, setPenalty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [asOfDate, setAsOfDate] = useState("2024-08-14");

  const [form, setForm] = useState({
    client_name: "Sugus",
    otr: 240000000,
    dp_percent: 20,
    tenor_month: 18,
    start_date: "2024-01-25",
  });

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const fetchContracts = async () => {
    try {
      const response = await api.get("/contracts");
      setContracts(response.data?.data || []);
    } catch (error) {
      console.error(error);
      setContracts([]);
      alert("Gagal mengambil data kontrak");
    }
  };

  const fetchDetail = async (id) => {
    try {
      const response = await api.get(`/contracts/${id}`);
      setSelectedContract(response.data?.data || null);
      setBilling(null);
      setPenalty(null);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil detail kontrak");
    }
  };

  const fetchBilling = async () => {
    if (!selectedContract) return;

    try {
      const response = await api.get(
        `/contracts/${selectedContract.id}/billing?date=${asOfDate}`
      );

      setBilling(response.data?.data || null);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data billing");
    }
  };

  const fetchPenalty = async () => {
    if (!selectedContract) return;

    try {
      const response = await api.get(
        `/contracts/${selectedContract.id}/penalty?date=${asOfDate}`
      );

      setPenalty(response.data?.data || null);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data denda");
    }
  };

  const downloadExcel = () => {
    if (!selectedContract) return;

    window.open(
      `${apiBaseUrl}/contracts/${selectedContract.id}/export-billing?date=${asOfDate}`,
      "_blank"
    );
  };

  const paySchedule = async (scheduleId) => {
    try {
      await api.post(`/schedules/${scheduleId}/pay`, {
        payment_date: asOfDate,
      });

      await fetchDetail(selectedContract.id);
      alert("Angsuran berhasil dibayar");
    } catch (error) {
      console.error(error);
      alert("Gagal melakukan pembayaran");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/contracts", {
        client_name: form.client_name,
        otr: Number(form.otr),
        dp_percent: Number(form.dp_percent),
        tenor_month: Number(form.tenor_month),
        start_date: form.start_date,
      });

      await fetchContracts();
      alert("Kontrak berhasil dibuat");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat kontrak");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  async function loadContracts() {
    await fetchContracts();
  }

  loadContracts();
}, []);

  const schedules = selectedContract?.schedules || [];
  const penaltyDetails = penalty?.penalty_details || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              IMS Finance
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="Total Kontrak" value={contracts?.length || 0} />
          <SummaryCard title="Test Date" value={asOfDate} />
          <SummaryCard
            title="Billing Due"
            value={billing ? formatRupiah(billing.total_installment_due) : "-"}
            color="text-blue-700"
          />
          <SummaryCard
            title="Total Denda"
            value={penalty ? formatRupiah(penalty.total_penalty) : "-"}
            color="text-red-600"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="text-lg font-black text-slate-900">Buat Kontrak</h2>
            <br />
            <div className="space-y-4">
              {[
                ["client_name", "Client Name", "text"],
                ["otr", "OTR", "number"],
                ["dp_percent", "DP (%)", "number"],
                ["tenor_month", "Tenor Bulan", "number"],
                ["start_date", "Tanggal Mulai Angsuran", "date"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label className="text-sm font-bold text-slate-700">
                    {label}
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              ))}

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-black text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-400"
              >
                <FiCreditCard />
                {loading ? "Menyimpan..." : "Generate Kontrak"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-black text-slate-900">
                Daftar Kontrak
              </h2>
              <p className="text-sm text-slate-500">
                Pilih kontrak untuk melihat jadwal dan tagihan.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-4">Kontrak No</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">OTR</th>
                    <th className="p-4">Tenor</th>
                    <th className="p-4">Angsuran</th>
                    <th className="p-4">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {(contracts || []).map((contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4 font-black text-slate-900">
                        {contract.contract_no}
                      </td>
                      <td className="p-4 font-semibold">
                        {contract.client_name}
                      </td>
                      <td className="p-4">{formatRupiah(contract.otr)}</td>
                      <td className="p-4">{contract.tenor_month} bulan</td>
                      <td className="p-4 font-bold text-blue-700">
                        {formatRupiah(contract.monthly_installment)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => fetchDetail(contract.id)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-700"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}

                  {(contracts || []).length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-6 text-center text-slate-500"
                      >
                        Belum ada kontrak.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {selectedContract && (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detail Kontrak: {selectedContract.contract_no}
                </h2>
                <p className="text-sm text-slate-500">
                  Client {selectedContract.client_name}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-blue-500"
                />

                <button
                  onClick={fetchBilling}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700"
                >
                  Cek Billing
                </button>

                <button
                  onClick={fetchPenalty}
                  className="flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700"
                >
                  <FiAlertTriangle />
                  Cek Denda
                </button>

                <button
                  onClick={downloadExcel}
                  className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
                >
                  <FaFileExcel />
                  Download Excel
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <InfoCard
                title="DP"
                value={formatRupiah(selectedContract.dp_amount)}
              />
              <InfoCard
                title="Pokok Utang"
                value={formatRupiah(selectedContract.loan_amount)}
              />
              <InfoCard
                title="Bunga"
                value={`${selectedContract.interest_rate}%`}
              />
              <InfoCard
                title="Angsuran / Bulan"
                value={formatRupiah(selectedContract.monthly_installment)}
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {billing && (
                <div className="rounded-3xl bg-blue-50 p-5 ring-1 ring-blue-100">
                  <p className="text-sm font-bold text-blue-700">
                    Total Angsuran Jatuh Tempo
                  </p>
                  <p className="mt-2 text-3xl font-black text-blue-900">
                    {formatRupiah(billing.total_installment_due)}
                  </p>
                </div>
              )}

              {penalty && (
                <div className="rounded-3xl bg-red-50 p-5 ring-1 ring-red-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-red-700">
                    <FiAlertTriangle />
                    <span>Total Denda Keterlambatan</span>
                  </div>
                  <p className="mt-2 text-3xl font-black text-red-900">
                    {formatRupiah(penalty.total_penalty)}
                  </p>
                </div>
              )}
            </div>

            {penalty && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-red-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="p-3">Angsuran Ke</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Hari Telat</th>
                      <th className="p-3">Denda</th>
                    </tr>
                  </thead>

                  <tbody>
                    {penaltyDetails.map((item) => (
                      <tr key={item.installment_no} className="border-b">
                        <td className="p-3 font-bold">{item.installment_no}</td>
                        <td className="p-3">{item.due_date}</td>
                        <td className="p-3">{item.days_late} hari</td>
                        <td className="p-3 font-bold text-red-600">
                          {formatRupiah(item.penalty_amount)}
                        </td>
                      </tr>
                    ))}

                    {penaltyDetails.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-6 text-center text-slate-500"
                        >
                          Tidak ada denda keterlambatan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <h3 className="mt-8 mb-4 text-lg font-black text-slate-900">
              Jadwal Angsuran
            </h3>

            <div className="max-h-130 overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-900 text-white">
                  <tr>
                    <th className="p-4">Ke</th>
                    <th className="p-4">Tanggal Jatuh Tempo</th>
                    <th className="p-4">Angsuran</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {schedules.map((schedule) => (
                    <tr
                      key={schedule.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4 font-bold">
                        {schedule.installment_no}
                      </td>
                      <td className="p-4">{schedule.due_date}</td>
                      <td className="p-4 font-bold">
                        {formatRupiah(schedule.installment_amount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            schedule.status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {schedule.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {schedule.status !== "paid" ? (
                          <button
                            onClick={() => paySchedule(schedule.id)}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                          >
                            <FiCheckCircle />
                            Bayar
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            Lunas
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {schedules.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-6 text-center text-slate-500"
                      >
                        Belum ada jadwal angsuran.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function SummaryCard({ title, value, color = "text-slate-900" }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-slate-400">{title}</p>
      <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <p className="text-xs font-black uppercase text-slate-400">{title}</p>
      <p className="mt-2 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

export default App;