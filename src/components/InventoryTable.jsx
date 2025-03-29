import { useState } from "react";
import{ useEffect } from "react";
import "./InventoryTable.css";
import Toast from "./Toast";
import "./Toast.css"; // Toastのスタイルをインポート


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
    showToast(" 新しい在庫を追加しました", "success");
  };

  const handleDelete = (index) => {
    const newInventory = inventory.filter((_, i) => i !== index);
    setInventory(newInventory);
    showToast(" 在庫を削除しました", "error");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setTempEdit(inventory[index]);
    showToast(" 編集モードに入りました", "info");
  };

  const handleSave = (index) => {
    const updatedInventory = [...inventory];
    updatedInventory[index] = tempEdit;
    setInventory(updatedInventory);
    setEditIndex(null);
    setTempEdit({});
    showToast(" 変更を保存しました", "warning");
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

const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState("success");


const showToast = (msg, type = "success") => {
  setToastMessage(msg);
  setToastType(type);
};
const closeToast = () => {
  setToastMessage("");
}
const exportToCSV = () => {
  const headers = ["品番", "品名", "生産日", "在庫", "保管場所", "状態", "備考"];
  const rows = inventory.map(item => [
    item.itemNumber,
    item.itemName,
    item.productionDate,
    item.stock,
    item.storageLocation,
    item.status,
    item.remarks
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventory.csv";
  a.click();

  showToast("📤 CSVエクスポート完了！", "success");
};


const importFromCSV = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map(row => row.split(","));
      const headers = rows[0];
      const inventoryData = rows.slice(1).map(row => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index];
          return obj;
        }, {});
      });

      if (inventoryData.length === 0) {
        showToast("⚠️ インポートするデータがありません", "warning");
        return;
      }
      
      setInventory(inventoryData);
      showToast("📥 CSVインポート完了！", "success");
    };
    reader.readAsText(file);
  };
  setEditIndex(null);
  setTempEdit({});
  document.body.appendChild(input);
  input.style.display = "none";
  input.click();
}
const clearInventory = () => {
  if (window.confirm("在庫をクリアしますか？")) {
    setInventory([]);
    localStorage.removeItem("inventoryData");
    showToast("🗑️ 在庫クリア完了", "error");
    setEditIndex(null);
    setTempEdit({});
    setForm({
      itemNumber: "",
      itemName: "",
      productionDate: "",
      stock: "",
      storageLocation: "",
      status: "",
      remarks: ""
    });
    setSearchKeyword("");
    setToastMessage("");
    setToastType("success");    
  }
}
 
  return (
    <div className="inventory-container">
      <form onSubmit={handleSubmit} className="inventory-form">
        <input placeholder="品番" name="itemNumber" value={form.itemNumber} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="品名" name="itemName" value={form.itemName} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input type="date" name="productionDate" value={form.productionDate} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input type="number" placeholder="在庫" name="stock" value={form.stock} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="保管場所" name="storageLocation" value={form.storageLocation} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="状態" name="status" value={form.status} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <input placeholder="備考" name="remarks" value={form.remarks} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        <button type="submit" disabled={isFormEmpty}>追加</button>
      </form>
      <div className="inventory-button-group">
        <button onClick={exportToCSV} className="export-btn">CSVエクスポート</button>
        <button onClick={importFromCSV} className="import-btn">CSVインポート</button>
        <button onClick={clearInventory} className="clear-btn">在庫クリア</button>
      </div>

      <input placeholder="検索..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="inventory-search"/>

      <table className="inventory-table">
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
            <tr key={index} className={editIndex === index ? "editing" : ""}>
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
                    <button className="save-btn" onClick={() => handleSave(index)}>保存</button>
                    <button className="cancel-btn" onClick={() => setEditIndex(null)}>キャンセル</button>
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
                    <button className="edit-btn" onClick={() => {handleEdit(index); setTempEdit(item);}}>編集</button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>削除</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>

      </table>
      <div className="inventory-footer">
        <p>合計在庫: {filteredInventory.reduce((sum, item) => sum + Number(item.stock), 0)}</p>
        <p>在庫数: {filteredInventory.length}</p>
      </div>
      <p className="inventory-footer">在庫管理システム</p>
      <p className="inventory-footer">© 2025</p>
      <Toast message={toastMessage} onClose={closeToast} type={toastType} />
    </div>
  );
}