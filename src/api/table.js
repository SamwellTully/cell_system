import axios from "axios";

/*
 url配置
 */
axios.defaults.baseURL = "http://8.134.49.56:8000"

export async function sample(upload_sample_data) {
  return (await axios.post("/C/sample", upload_sample_data)).data;
}

export async function limits(limitations) {
  let formOfLimits = new FormData()
  formOfLimits.append("JsonString", JSON.stringify(limitations))
  return (await axios.post("/C/limits", formOfLimits)).data;
}

export async function createTable(table_info) {
  let formData = new FormData();
  formData.append("JsonString", JSON.stringify(table_info));
  return (await axios.post("/C/createTable", formData)).data;
}

export async function getList(token) {
  
  return (await axios.get("/G/selectGenertable?token="+token)).data
}

export async function getListById(id) {
  let params = new URLSearchParams();
  params.append("id", id);
  return (await axios.post("/G/GetTables", params)).data
}

