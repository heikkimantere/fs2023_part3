import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => axios.get(baseUrl).then((res) => res.data);

const add = (data) => axios.post(baseUrl, data).then((res) => res.data);

const deleteById = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((res) => res.data);

const replaceById = (newPerson) =>
  axios.put(`${baseUrl}/${newPerson.id}`, newPerson).then((res) => res.data);

export default { getAll, add, deleteById, replaceById };
