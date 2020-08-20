function saveToLocal(key, value) {
  let vuecms = localStorage.getItem("userInfo")
  if (!vuecms) {
    vuecms = {}
  } else {
    vuecms = JSON.parse(vuecms)
  }
  vuecms[key] = value
  localStorage.setItem('userInfo', JSON.stringify(vuecms))
}

export { saveToLocal }