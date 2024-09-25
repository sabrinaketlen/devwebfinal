<template>
    <div class="not-authorized">
      <h1>403</h1>
      <p>Desculpe! Acesso negado.</p>
      <p>Você não tem permissão para acessar esta página. Faça login ou verifique suas permissões.</p>
    </div>
  </template>
  
  <style scoped>
  .not-authorized {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    color: #333;
  }
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: #ff6b6b;
  }
  
  p {
    font-size: 1.2rem;
    margin: 10px 0;
  }
  </style>
  