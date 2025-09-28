import { useEffect, useState } from "react";
import api from "../services/api";

export default function ReportPage() {
  const [report, setReport] = useState(null);

  async function load() {
    try {
      const res = await api.get("/deliveries/report");
      setReport(res.data);
    } catch (err) {
      alert("Erro ao carregar relatório: " + (err?.response?.data?.erro || err.message));
    }
  }

  useEffect(() => { load(); }, []);

  if (!report) return <div><h2>Relatório</h2><p>Carregando...</p></div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Relatório</h2>

      {/* Resumo */}
      <section className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Entregas</p>
          <p className="text-xl font-bold">{report.resumo.totalDeliveries}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Finalizadas</p>
          <p className="text-xl font-bold">{report.resumo.finished}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Em progresso</p>
          <p className="text-xl font-bold">{report.resumo.inProgress}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Rejeitadas</p>
          <p className="text-xl font-bold">{report.resumo.rejected}</p>
        </div>
      </section>

      {/* Pedidos e distância */}
      <section className="mb-6">
        <p><strong>Pedidos entregues:</strong> {report.pedidosEntregues}</p>
        <p><strong>Distância total percorrida:</strong> {report.distanciaTotalPercorrida.toFixed(1)} km</p>
      </section>

      {/* Por drone */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold">Estatísticas por Drone</h3>
        <table className="min-w-full border mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Drone</th>
              <th className="border px-2 py-1">Entregas</th>
              <th className="border px-2 py-1">Distância (km)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(report.drones).map(([id, stats]) => (
              <tr key={id}>
                <td className="border px-2 py-1">#{id}</td>
                <td className="border px-2 py-1">{stats.deliveries}</td>
                <td className="border px-2 py-1">{stats.distance.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Última entrega */}
      <section>
        <h3 className="text-lg font-semibold">Última Entrega</h3>
        {report.ultimaEntrega ? (
          <div className="border rounded p-4 bg-gray-50">
            <p><strong>ID:</strong> {report.ultimaEntrega.id}</p>
            <p><strong>Status:</strong> {report.ultimaEntrega.status}</p>
            <p><strong>Pedidos:</strong> {report.ultimaEntrega.orders.join(", ")}</p>
            <p><strong>Ordem planejada:</strong> {report.ultimaEntrega.orderSequence?.join(" → ")}</p>
          </div>
        ) : (
          <p>Nenhuma entrega registrada.</p>
        )}
      </section>
    </div>
  );
}
