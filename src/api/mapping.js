import axios from "axios";

/*
 url配置
 */
axios.defaults.baseURL = "http://8.134.49.56:8000"

export async function getUser(UserId, Tablename) {
  let params = new URLSearchParams();
  params.set("UserId", UserId)
  params.set("Tablename", Tablename)
  return (await axios.post("/mappings/check", params)).data;
}



export async function checkRelation(UserId, Tablename, ) {
  let params = new URLSearchParams();
  params.append("UserId", UserId);
  return (await axios.post("/mappings/checkRelation", params)).data
}

export async function checkContext(UserId, Tablename, id) {
  let params = new URLSearchParams();
  params.append("UserId", UserId);
  params.append("Tablename", Tablename);
  params.append("id", id); 
  return (await axios.post("/mappings/checkContext", params)).data
}

export async function deleteHisMapping(mapping_id, UserId) {
  let params = new URLSearchParams();
  params.append("id", mapping_id); 
  params.append("UserId", UserId); 
  return (await axios.post("/mappings/delete", params)).data
}

export async function downloadHisMapping(mapping_id) {
  return (await axios.get("/mappings/download?id=" + mapping_id)).data
}

export async function getPublicMappings() {
  return (await axios.get("/mappings/checkAllData")).data
}

export async function getPrivateMappings(UserId) {
  let params = new URLSearchParams();
  params.append("UserId", UserId); 
  return (await axios.post("/mappings/checkRelation", params)).data
}

// checkRelationById，返回的结果：
// editRelationMap
