document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.querySelector('.close-modal');
    const goToLogin = document.getElementById('go-to-login');
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        if (value.length > 0) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        
        if (value.length > 10) {
            value = value.substring(0, 10) + '-' + value.substring(10);
        }
        
        e.target.value = value;
    });
    
    // Validação de senha
    const senhaInput = document.getElementById('senha');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    senhaInput.addEventListener('input', function() {
        const password = senhaInput.value;
        let strength = 0;
        
        // Verifica o comprimento
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Verifica caracteres diversos
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Atualiza a barra e o texto
        let width = 0;
        let text = '';
        let color = '';
        
        switch(strength) {
            case 0:
            case 1:
                width = 25;
                text = 'Fraca';
                color = '#e74c3c';
                break;
            case 2:
            case 3:
                width = 50;
                text = 'Moderada';
                color = '#f39c12';
                break;
            case 4:
                width = 75;
                text = 'Forte';
                color = '#3498db';
                break;
            case 5:
                width = 100;
                text = 'Muito Forte';
                color = '#2ecc71';
                break;
        }
        
        strengthBar.style.width = `${width}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    });
    
    // Validação do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Resetar mensagens de erro
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        let isValid = true;
        
        // Validação do nome
        const nome = document.getElementById('nome');
        if (nome.value.trim() === '') {
            showError('nome-error', 'Por favor, insira seu nome completo');
            isValid = false;
        }
        
        // Validação do email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError('email-error', 'Por favor, insira um e-mail válido');
            isValid = false;
        }
        
        // Validação do telefone
        const telefone = document.getElementById('telefone');
        const telefoneDigits = telefone.value.replace(/\D/g, '');
        if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
            showError('telefone-error', 'Por favor, insira um telefone válido');
            isValid = false;
        }
        
        // Validação da senha
        const senha = document.getElementById('senha');
        if (senha.value.length < 8) {
            showError('senha-error', 'A senha deve ter pelo menos 8 caracteres');
            isValid = false;
        }
        
        // Validação de confirmação de senha
        const confirmarSenha = document.getElementById('confirmar-senha');
        if (confirmarSenha.value !== senha.value) {
            showError('confirmar-senha-error', 'As senhas não coincidem');
            isValid = false;
        }
        
        // Validação da cidade
        const cidade = document.getElementById('cidade');
        if (cidade.value.trim() === '') {
            showError('cidade-error', 'Por favor, insira sua cidade');
            isValid = false;
        }
        
        // Validação do estado
        const estado = document.getElementById('estado');
        if (estado.value === '') {
            showError('estado-error', 'Por favor, selecione seu estado');
            isValid = false;
        }
        
        // Validação dos termos
        const termos = document.getElementById('termos');
        if (!termos.checked) {
            showError('termos-error', 'Você deve aceitar os termos para continuar');
            isValid = false;
        }
        
        if (isValid) {
            // Simular envio do formulário
            setTimeout(() => {
                successModal.style.display = 'flex';
                form.reset();
            }, 500);
        }
    });
    
    // Fechar modal
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    goToLogin.addEventListener('click', function() {
        successModal.style.display = 'none';
        // Aqui você redirecionaria para a página de login
        alert('Redirecionando para a página de login...');
    });
    
    // Função auxiliar para mostrar erros
    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
});