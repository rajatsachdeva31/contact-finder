"use client";

import { useState } from "react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const provinces = [
  { value: "", label: "Select Province/State" },
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
];

const ContactSearch = () => {
  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  const handleSearch = async () => {
    const response = await fetch("/contacts.json");
    const data = await response.json();
    const filteredContacts = data.filter((contact: Contact) => {
      return (
        (searchParams.firstName
          ? contact.firstName
              .toLowerCase()
              .includes(searchParams.firstName.toLowerCase())
          : true) &&
        (searchParams.lastName
          ? contact.lastName
              .toLowerCase()
              .includes(searchParams.lastName.toLowerCase())
          : true) &&
        (searchParams.dob ? contact.dob === searchParams.dob : true) &&
        (searchParams.email
          ? contact.email
              .toLowerCase()
              .includes(searchParams.email.toLowerCase())
          : true) &&
        (searchParams.phone
          ? contact.phone.includes(searchParams.phone)
          : true) &&
        (searchParams.street
          ? contact.street
              .toLowerCase()
              .includes(searchParams.street.toLowerCase())
          : true) &&
        (searchParams.city
          ? contact.city.toLowerCase().includes(searchParams.city.toLowerCase())
          : true) &&
        (searchParams.state ? contact.state === searchParams.state : true) &&
        (searchParams.zipCode
          ? contact.zipCode.includes(searchParams.zipCode)
          : true)
      );
    });
    setContacts(filteredContacts);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCheckboxChange = (contactId: string) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const paginatedContacts = contacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Finder</h1>
      <div className="flex justify-between">
        <div className="gap-4 flex flex-wrap">
          <input
            type="text"
            placeholder="First Name"
            value={searchParams.firstName}
            onChange={(e) =>
              setSearchParams({ ...searchParams, firstName: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={searchParams.lastName}
            onChange={(e) =>
              setSearchParams({ ...searchParams, lastName: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={searchParams.dob}
            onChange={(e) =>
              setSearchParams({ ...searchParams, dob: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={searchParams.email}
            onChange={(e) =>
              setSearchParams({ ...searchParams, email: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={searchParams.phone}
            onChange={(e) =>
              setSearchParams({ ...searchParams, phone: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="gap-4 flex flex-wrap">
          <input
            type="text"
            placeholder="Street Address"
            value={searchParams.street}
            onChange={(e) =>
              setSearchParams({ ...searchParams, street: e.target.value })
            }
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="City"
            value={searchParams.city}
            onChange={(e) =>
              setSearchParams({ ...searchParams, city: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={searchParams.state}
            onChange={(e) =>
              setSearchParams({ ...searchParams, state: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {provinces.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Postal Code"
            value={searchParams.zipCode}
            onChange={(e) =>
              setSearchParams({ ...searchParams, zipCode: e.target.value })
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="border border-blue-500 text-blue-500 p-2 my-4 w-28 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
      >
        Search
      </button>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContacts(new Set(contacts.map((c) => c.id)));
                    } else {
                      setSelectedContacts(new Set());
                    }
                  }}
                  checked={
                    contacts.length > 0 &&
                    selectedContacts.size === contacts.length
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">DoB</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Phone</th>
              <th className="p-3 text-left border">Address</th>
              <th className="p-3 text-left border">City</th>
              <th className="p-3 text-left border">Province</th>
              <th className="p-3 text-left border">Zip</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectContact(contact)}
              >
                <td className="p-3 border" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedContacts.has(contact.id)}
                    onChange={() => {
                      handleCheckboxChange(contact.id);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3 border">{`${contact.firstName} ${contact.lastName}`}</td>
                <td className="p-3 border">{contact.dob}</td>
                <td className="p-3 border">{contact.email}</td>
                <td className="p-3 border">{contact.phone}</td>
                <td className="p-3 border">{contact.street}</td>
                <td className="p-3 border">{contact.city}</td>
                <td className="p-3 border">{contact.state}</td>
                <td className="p-3 border">{contact.zipCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedContact && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Selected Contact</h2>
          <p className="mb-2">
            <span className="font-medium">Name:</span>{" "}
            {`${selectedContact.firstName ? selectedContact.firstName : ""} ${
              selectedContact.lastName ? selectedContact.lastName : ""
            }`}
          </p>
          <p className="mb-2">
            <span className="font-medium">Email:</span>{" "}
            {selectedContact.email ? selectedContact.email : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Phone:</span>{" "}
            {selectedContact.phone ? selectedContact.phone : "Not Available"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Address:</span>{" "}
            {(selectedContact.street ||
              selectedContact.city ||
              selectedContact.state ||
              selectedContact.zipCode) &&
              `${selectedContact.street ? selectedContact.street : ""}, ${
                selectedContact.city ? selectedContact.city : ""
              }, ${selectedContact.state ? selectedContact.state : ""} ${
                selectedContact.zipCode ? selectedContact.zipCode : ""
              }`}
          </p>
        </div>
      )}
      {contacts.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * contactsPerPage + 1} to{" "}
            {Math.min(currentPage * contactsPerPage, contacts.length)} of{" "}
            {contacts.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSearch;
