const trocarModal = (event) => {
  event.preventDefault(); // Evitar o comportamento padrão do botão dentro de um formulário
  const modal = document.querySelector('.modal');
  const estiloAtual = getComputedStyle(modal).display;

  if (estiloAtual === 'block') {
    modal.style.display = 'none';
  } else {
    modal.style.display = 'block';
  }
}

const btn = document.querySelector('.modalBtn');
btn.addEventListener('click', trocarModal);

window.onclick = function (event) {
  const modal = document.querySelector('.modal');
  if (event.target === modal) {
    trocarModal(event);
  }
}