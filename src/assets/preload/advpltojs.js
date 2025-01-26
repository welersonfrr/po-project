(codeType, content) => {
  console.log(`Preload - codeType: ${codeType} - content: ${content}`)

  if (codeType == 'filiaisComAcesso') {
    sessionStorage.setItem('FILIAIS', content)
  }
  if (codeType == 'currentFilial') {
    sessionStorage.setItem('currentFilial', content)
  }
  if (codeType == 'currentEmpresa') {
    sessionStorage.setItem('currentEmpresa', content)
  }
}
