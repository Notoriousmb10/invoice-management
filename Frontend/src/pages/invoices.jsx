import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  const [filters, setFilters] = useState({
    fy: "",
    invoiceNumber: "",
    startDate: "",
    endDate: "",
  });

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    invoiceAmount: "",
  });

  const [page, setPage] = useState(1);

  const fetchInvoices = async () => {
    try {
      const query = new URLSearchParams({
        ...filters,
        page,
      }).toString();
      const res = await API.get(`/invoice?${query}`);
      setInvoices(res.data.invoices);
      console.log(invoices);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/invoice/create", invoiceForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Invoice created");
      setInvoiceForm({
        invoiceNumber: "",
        invoiceDate: "",
        invoiceAmount: "",
      });
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.msg || "Invoice creation failed");
    }
  };

  const handleDelete = async (invoiceNumber) => {
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return;
    try {
      await API.delete(`/invoice/delete/${invoiceNumber}`);
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Invoice Management</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded shadow space-y-3 mb-6"
      >
        <h2 className="font-semibold">Create Invoice</h2>
        <input
          type="number"
          placeholder="Invoice Number"
          value={invoiceForm.invoiceNumber}
          onChange={(e) =>
            setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })
          }
          className="w-full border p-2"
        />
        <input
          type="date"
          placeholder="Invoice Date"
          value={invoiceForm.invoiceDate}
          onChange={(e) =>
            setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })
          }
          className="w-full border p-2"
        />
        <input
          type="number"
          placeholder="Invoice Amount"
          value={invoiceForm.invoiceAmount}
          onChange={(e) =>
            setInvoiceForm({ ...invoiceForm, invoiceAmount: e.target.value })
          }
          className="w-full border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="FY (e.g. 2022-2023)"
          value={filters.fy}
          onChange={(e) => setFilters({ ...filters, fy: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Invoice Number"
          value={filters.invoiceNumber}
          onChange={(e) =>
            setFilters({ ...filters, invoiceNumber: e.target.value })
          }
          className="border p-2"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          className="border p-2"
        />
        <input
          type="date"
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="border p-2"
        />
        <button
          onClick={fetchInvoices}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Apply Filters
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Invoice No.</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">FY</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices?.map((inv) => (
            <tr key={inv._id}>
              <td className="border p-2">{inv.invoiceNumber}</td>
              <td className="border p-2">
                {new Date(inv.invoiceDate).toLocaleDateString()}
              </td>
              <td className="border p-2">₹ {inv.invoiceAmount}</td>
              <td className="border p-2">{inv.financialYear}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(inv.invoiceNumber)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ⬅ Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next ➡</button>
      </div>
    </div>
  );
};

export default Invoices;
