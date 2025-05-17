import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
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

  const [editForm, setEditForm] = useState({
    invoiceDate: "",
    invoiceAmount: "",
  });

  const [page, setPage] = useState(1);

  const fetchInvoices = async () => {
    try {
      const query = new URLSearchParams({ ...filters, page }).toString();
      const res = await API.get(`/invoice?${query}`);
      setInvoices(res.data.invoices);
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
      await API.post("/invoice/create", invoiceForm);
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

  const handleEditClick = (inv) => {
    setEditingInvoice(inv);
    setEditForm({
      invoiceDate: inv.invoiceDate.slice(0, 10),
      invoiceAmount: inv.invoiceAmount,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/invoice/update/${editingInvoice.invoiceNumber}`, {
        invoiceDate: editForm.invoiceDate,
        invoiceAmount: editForm.invoiceAmount,
      });
      alert("Invoice updated");
      setEditingInvoice(null);
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
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
   <div className="min-h-screen bg-gray-100 pl-64 flex">
    <div className="flex-1 max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📄 Invoice Management</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">➕ Create Invoice</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Invoice Number"
              value={invoiceForm.invoiceNumber}
              onChange={(e) =>
                setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })
              }
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="date"
              placeholder="Invoice Date"
              value={invoiceForm.invoiceDate}
              onChange={(e) =>
                setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })
              }
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="number"
              placeholder="Invoice Amount"
              value={invoiceForm.invoiceAmount}
              onChange={(e) =>
                setInvoiceForm({ ...invoiceForm, invoiceAmount: e.target.value })
              }
              className="border border-gray-300 p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-1 md:col-span-3"
            >
              Create Invoice
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">🔍 Filter Invoices</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="FY (e.g. 2022-2023)"
              value={filters.fy}
              onChange={(e) => setFilters({ ...filters, fy: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="number"
              placeholder="Invoice Number"
              value={filters.invoiceNumber}
              onChange={(e) =>
                setFilters({ ...filters, invoiceNumber: e.target.value })
              }
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="border border-gray-300 p-2 rounded"
            />
            <button
              onClick={fetchInvoices}
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 col-span-1 md:col-span-1"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Invoice No.</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">FY</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((inv) =>
                editingInvoice && editingInvoice._id === inv._id ? (
                  <tr key={inv._id} className="bg-yellow-50">
                    <td className="p-3">{inv.invoiceNumber}</td>
                    <td className="p-3">
                      <input
                        type="date"
                        name="invoiceDate"
                        value={editForm.invoiceDate}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        name="invoiceAmount"
                        value={editForm.invoiceAmount}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-1 rounded"
                      />
                    </td>
                    <td className="p-3">{inv.financialYear}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="p-3">{inv.invoiceNumber}</td>
                    <td className="p-3">
                      {new Date(inv.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">₹ {inv.invoiceAmount}</td>
                    <td className="p-3">{inv.financialYear}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditClick(inv)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inv.invoiceNumber)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
