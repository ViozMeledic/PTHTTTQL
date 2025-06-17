// const API_URL = 'http://localhost:5500/api/employees';

// const tbody = document.querySelector('#employeesTable tbody');
// const form = document.getElementById('employeeForm');
// const formTitle = document.getElementById('formTitle');
// const modalInstance = new bootstrap.Modal(document.getElementById('employeeModal'));

// const codeInput = document.getElementById('employeeCode');
// const nameInput = document.getElementById('employeeName');
// const positionInput = document.getElementById('employeePosition');
// const emailInput = document.getElementById('employeeEmail');

// let editingCode = null;

// async function fetchEmployees() {
//   try {
//     const res = await fetch(API_URL);
//     const data = await res.json();
//     renderEmployees(data);
//   } catch (error) {
//     alert('Lỗi khi lấy danh sách nhân viên');
//     console.error(error);
//   }
// }

// function renderEmployees(employees) {
//   tbody.innerHTML = '';
//   employees.forEach(e => {
//     const row = `
//       <tr>
//         <td>${e.code}</td>
//         <td>${e.name}</td>
//         <td>${e.position}</td>
//         <td>${e.email}</td>
//         <td class="text-center text-nowrap">
//           <div class="d-inline-flex gap-1">
//             <button class="btn btn-sm btn-warning" onclick="editEmployee('${e.code}')">
//               <i class="bi bi-pencil"></i>
//             </button>
//             <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${e.code}')">
//               <i class="bi bi-trash"></i>
//             </button>
//           </div>
//         </td>
//       </tr>
//     `;
//     tbody.insertAdjacentHTML('beforeend', row);
//   });
// }

// function openAddForm() {
//   editingCode = null;
//   formTitle.textContent = 'Thêm nhân viên';
//   form.reset();
//   codeInput.disabled = false;
//   modalInstance.show();
// }

// async function editEmployee(code) {
//   try {
//     const res = await fetch(`${API_URL}`);
//     const employees = await res.json();
//     const e = employees.find(emp => emp.code === code);
//     if (!e) return alert('Không tìm thấy nhân viên');

//     editingCode = code;
//     formTitle.textContent = 'Chỉnh sửa nhân viên';
//     codeInput.value = e.code;
//     nameInput.value = e.name;
//     positionInput.value = e.position;
//     emailInput.value = e.email;
//     codeInput.disabled = true;
//     modalInstance.show();
//   } catch (error) {
//     alert('Lỗi khi lấy thông tin nhân viên');
//     console.error(error);
//   }
// }

// async function deleteEmployee(code) {
//   if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
//   try {
//     const res = await fetch(`${API_URL}/${code}`, { method: 'DELETE' });
//     if (res.ok) {
//       alert('Xóa nhân viên thành công');
//       fetchEmployees();
//     } else {
//       alert('Lỗi khi xóa nhân viên');
//     }
//   } catch (error) {
//     alert('Lỗi khi xóa nhân viên');
//     console.error(error);
//   }
// }

// form.addEventListener('submit', async function (e) {
//   e.preventDefault();
//   const code = codeInput.value.trim();
//   const name = nameInput.value.trim();
//   const position = positionInput.value.trim();
//   const email = emailInput.value.trim();

//   if (!code || !name || !position || !email) {
//     alert('Vui lòng nhập đầy đủ thông tin!');
//     return;
//   }

//   try {
//     if (editingCode === null) {
//       // Thêm mới
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ code, name, position, email }),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         alert('Lỗi khi thêm nhân viên: ' + err.message);
//         return;
//       }
//       alert('Thêm nhân viên thành công');
//     } else {
//       // Cập nhật
//       const res = await fetch(`${API_URL}/${editingCode}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, position, email }),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         alert('Lỗi khi cập nhật nhân viên: ' + err.message);
//         return;
//       }
//       alert('Cập nhật nhân viên thành công');
//     }
//     modalInstance.hide();
//     fetchEmployees();
//   } catch (error) {
//     alert('Lỗi khi lưu nhân viên');
//     console.error(error);
//   }
// });

// fetchEmployees();
