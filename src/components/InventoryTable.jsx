import { useState } from "react";
import{ useEffect } from "react";

export default function InventoryTable() {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    itemNumber: "",
    itemName: "",
    productionDate: "",
    stock: "",
    storageLocation: "",
    status: "",
    remarks: ""
  });

  const [editIndex, setEditIndex] = useState(null); // 編集中のトラック行
  const isFormEmpty = Object.values(form).some(val => val === "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormEmpty) return; // フォームが空の場合は送信しない
    setInventory([...inventory, form]);
    setForm({
      itemNumber: "",
      itemName: "",
      productionDate: "",
      stock: "",
      storageLocation: "",
      status: "",
      remarks: ""
    });
  };

  const handleDelete = (index) => {
    const newInventory = inventory.filter((_, i) => i !== index);
    setInventory(newInventory);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = (index) => {
    const updatedInventory = [...inventory];
    updatedInventory[index] = tempEdit;
    setInventory(updatedInventory);
    setEditIndex(null);
  };

  const [tempEdit, setTempEdit] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("inventoryData"));
    if (saved) setInventory(saved);
  }, []);
  
  useEffect(() => {
    localStorage.setItem("inventoryData", JSON.stringify(inventory));
  }, [inventory]);

  const [searchKeyword, setSearchKeyword] = useState("");

const filteredInventory = inventory.filter(item =>
  Object.values(item).some(val =>
    String(val).toLowerCase().includes(searchKeyword.toLowerCase())
  )
);

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="品番" name="itemNumber" value={form.itemNumber} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="品名" name="itemName" value={form.itemName} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input type="date" name="productionDate" value={form.productionDate} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input type="number" placeholder="在庫" name="stock" value={form.stock} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="保管場所" name="storageLocation" value={form.storageLocation} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="状態" name="status" value={form.status} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="備考" name="remarks" value={form.remarks} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <button type="submit" disabled={isFormEmpty}>追加</button>
      </form>

      <input placeholder="検索..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>

      <table>
        <thead>
          <tr>
            <th>品番</th>
            <th>品名</th>
            <th>生産日</th>
            <th>在庫</th>
            <th>保管場所</th>
            <th>状態</th>
            <th>備考</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
        {filteredInventory.map((item, index) => (
            <tr key={index}>
              {editIndex === index ? (
                <>
                  {["itemNumber", "itemName", "productionDate", "stock", "storageLocation", "status", "remarks"].map((key) => (
                    <td key={key}>
                      <input
                        type={key === "stock" ? "number" : "text"}
                        value={tempEdit[key] !== undefined ? tempEdit[key] : item[key]}
                        onChange={(e) =>
                          setTempEdit({ ...tempEdit, [key]: e.target.value })
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleSave(index)}>保存</button>
                    <button onClick={() => setEditIndex(null)}>キャンセル</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.itemNumber}</td>
                  <td>{item.itemName}</td>
                  <td>{item.productionDate}</td>
                  <td>{item.stock}</td>
                  <td>{item.storageLocation}</td>
                  <td>{item.status}</td>
                  <td>{item.remarks}</td>
                  <td>
                    <button onClick={() => {
                      handleEdit(index);
                      setTempEdit(item);
                    }}>
                      編集
                    </button>
                    <button onClick={() => handleDelete(index)}>削除</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}