// // import logo from './logo.svg';
// // import './App.css';
// import React, {useState, useEffect} from "react"
// import api from "./api";

// const App = () => {

//   const[transactions, setTransactions] = useState([]);
//   const [formData, setFormData] = useState({
//     amount: '',
//     category: '',
//     description: '',
//     is_income: false,
//     date: '',
//   });

//   const fetchTransactions = async() => {
//     const response = await api.get('/transactions/');
//     setTransactions(response.data)
//   };

//   useEffect(()=>{
//     fetchTransactions();
//   },[]);

//   const handleInputChange = (event) => {
//     const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
//     setFormData({
//       ...formData,
//       [event.target.name]: value
//     });
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     await api.post('/transactions/', formData);
//     fetchTransactions();
//     setFormData({
//       amount: '',
//     category: '',
//     description: '',
//     is_income: false,
//     date: '',
//     });
//   };

//   return(
//     <div>

//       <nav className="navbar navbar-dark bg-primary">
//         <div className="container-fluid">
//             <a className="navbar-brand" href="#">
//               Finance
//             </a>
//         </div>
//       </nav>

//         <div className="container">
//           <form onSubmit={handleFormSubmit}>

//             <div className="mb-3 mt-3">
//               <label htmlFor="amount" className='form-label'>
//                 Amount
//               </label>
//               <input type="text" className="form-control" id="amount" name="amount" onChange={handleInputChange} value={formData.amount} />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="category" className='form-label'>
//                 Category
//               </label>
//               <input type="text" className="form-control" id="category" name="category" onChange={handleInputChange} value={formData.category} />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="description" className='form-label'>
//                 Description
//               </label>
//               <input type="text" className="form-control" id="description" name="description" onChange={handleInputChange} value={formData.description} />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="is_income" className='form-label'>
//                 Income?&nbsp;&nbsp;
//               </label>
//               <input type="checkbox" id="is_income" name="is_income" onChange={handleInputChange} value={formData.is_income} />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="date" className='form-label'>
//                 Date
//               </label>
//               <input type="text" className="form-control" id="date" name="date" onChange={handleInputChange} value={formData.date} />
//             </div>

//             <button type="submit" className="btn btn-primary">
//               Submit
//             </button>
//             <div style={{ marginTop: '50px' }} />

//             <table className="table table-striped table-bordered table-hover">
//               <thead>
//                   <tr>
//                     <th>Amount</th>
//                     <th>Category</th>
//                     <th>Description</th>
//                     <th>Income ?</th>
//                     <th>Date</th>
//                   </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((transaction) => (
//                   <tr key={transaction.id}>
//                     <td>{transaction.amount}</td>
//                     <td>{transaction.category}</td>
//                     <td>{transaction.description}</td>
//                     <td>{transaction.is_income ? 'Yes' : 'No'}</td>
//                     <td>{transaction.date}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </form>
//         </div>
//     </div>
//   )

// }

// // function App() {
// //   return (
// //     <div>

// //     </div>
// //   );
// // }
// export default App;

import React, { useState, useEffect } from "react";
import api from "./api";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: "",
  });

  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    setTransactions(response.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate that the 'amount' field is not empty
    if (!formData.amount.trim()) {
      alert("Please enter a value for 'Amount'");
      return;
    }

    // Validate that the 'category' field is not empty
    if (!formData.category.trim()) {
      alert("Please enter a value for 'Category'");
      return;
    }

    // Validate that the 'date' field is not empty
    if (!formData.date.trim()) {
      alert("Please enter a value for 'Date'");
      return;
    }

    if (formData.id) {
      // If formData has an 'id', it means we are updating an existing transaction
      await api.put(`/transactions/${formData.id}`, formData);
    } else {
      // If formData does not have an 'id', it means we are creating a new transaction
      await api.post("/transactions/", formData);
    }

    fetchTransactions();
    setFormData({
      amount: "",
      category: "",
      description: "",
      is_income: false,
      date: "",
    });
  };

  const handleUpdate = (transactionId) => {
    const transactionToUpdate = transactions.find(
      (transaction) => transaction.id === transactionId
    );
    if (transactionToUpdate) {
      setFormData({ ...transactionToUpdate });
    }
  };

  const handleDelete = async (transactionId) => {
    await api.delete(`/transactions/${transactionId}`);
    fetchTransactions();
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Finance
          </a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="amount"
              name="amount"
              onChange={handleInputChange}
              value={formData.amount}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              onChange={handleInputChange}
              value={formData.category}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={handleInputChange}
              value={formData.description}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="is_income" className="form-label">
              Income?&nbsp;&nbsp;
            </label>
            <input
              type="checkbox"
              id="is_income"
              name="is_income"
              onChange={handleInputChange}
              checked={formData.is_income}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              onChange={handleInputChange}
              value={formData.date}
              placeholder="DD/MM/YYYY"
              style={{ color: "gray" }}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {formData.id ? "Update" : "Submit"}
          </button>
        </form>
        <div style={{ marginTop: "50px" }} />

        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Income?</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? "Yes" : "No"}</td>
                <td>{transaction.date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                    onClick={() => handleUpdate(transaction.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
