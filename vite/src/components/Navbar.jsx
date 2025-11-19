// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useCart } from "../../context/CartContext";

// export default function Navbar() {
//   const { totalItems } = useCart();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);

//   const navigate = useNavigate();
//   const inputRef = useRef(null);
//   const profileRef = useRef(null);

//   // ⭐ JWT USER DATA
//   const [user, setUser] = useState(null);

//   // ⭐ LOAD USER DATA ON MOUNT
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) return;

//     // If you saved email in localStorage during login
//     const email = localStorage.getItem("userEmail");
//     if (email) {
//       setUser({ email });
//     }
//   }, []);

//   /* ------------------------------
//      🔎 SEARCH LOGIC
//   ------------------------------ */
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     const timeout = setTimeout(() => {
//       axios
//         .get(
//           `https://dummyjson.com/products/search?q=${encodeURIComponent(
//             searchTerm
//           )}&limit=4`
//         )
//         .then((res) => {
//           setSuggestions(res.data.products || []);
//           setShowDropdown(true);
//         })
//         .catch(() => setSuggestions([]));
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [searchTerm]);

//   const handleSuggestionClick = (term) => {
//     setShowDropdown(false);
//     setSearchTerm("");
//     navigate(`/products?search=${encodeURIComponent(term)}`);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;
//     navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
//     setShowDropdown(false);
//     setSearchTerm("");
//   };

//   /* ------------------------------
//      🔐 LOGOUT HANDLER (JWT)
//   ------------------------------ */
//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("userEmail");

//     setUser(null);
//     navigate("/login");
//   };

//   /* ------------------------------
//      CLOSE DROPDOWNS ON OUTSIDE CLICK
//   ------------------------------ */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (inputRef.current && !inputRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="navbar">
//       {/* LEFT */}
//       <div className="leftSection">
//         <Link to="/" className="logo">
//           <img src="/image.png" alt="OS" />
//         </Link>
//       </div>

//       {/* SEARCH */}
//       <div className="searchWrapper" ref={inputRef}>
//         <form className="searchBar" onSubmit={handleSearch}>
//           <input
//             type="text"
//             placeholder="Search OS store..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onFocus={() => searchTerm && setShowDropdown(true)}
//           />
//           <button type="submit">🔍</button>
//         </form>

//         {showDropdown && suggestions.length > 0 && (
//           <ul className="suggestionsDropdown">
//             {suggestions.map((prod) => (
//               <li
//                 key={prod.id}
//                 onMouseDown={() => handleSuggestionClick(prod.title)}
//               >
//                 {prod.title}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* RIGHT */}
//       <div className="rightSection">
//         {/* USER PROFILE */}
//         {user ? (
//           <div className="profileWrapper" ref={profileRef}>
//             <div
//               className="profileAvatar"
//               onClick={() => setProfileMenuOpen((prev) => !prev)}
//             >
//               {user.email.charAt(0).toUpperCase()}
//             </div>

//             {profileMenuOpen && (
//               <div className="profileDropdown">
//                 <p className="profileEmail">{user.email}</p>
//                 <button onClick={handleLogout} className="logoutButton">
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="navOption">
//             <span className="lineOne">Hello, Sign in</span>
//             <Link to="/login" className="lineTwo">
//               Account & Lists
//             </Link>
//           </div>
//         )}

//         {/* ORDERS */}
//         {user && (
//           <Link to="/orders" className="navOption">
//             Your Orders
//           </Link>
//         )}

//         {/* CART */}
//         <div className="cart">
//           <Link to="/cart" className="cartLink">
//             🛒
//             {totalItems > 0 && (
//               <span className="cartCount">{totalItems}</span>
//             )}
//             <span className="cartText">Cart</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
