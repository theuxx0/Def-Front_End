document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let editIndex = null;
    let nextId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1; // Gera o próximo ID

    // Salva os usuários no LocalStorage
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Renderiza os usuários na tabela
    function renderUsers() {
        userTable.innerHTML = '';
        users.forEach((user, index) => {
            const row = userTable.insertRow();
            row.innerHTML = `
             <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td class="actions">
                    <button class="edit" onclick="editUser(${index})">Editar</button>
                    <button class="delete" onclick="deleteUser(${index})">Excluir</button>
                </td>
            `;
        });
    }

    // Valida se o e-mail ou telefone já existem
    function isDuplicate(email, phone, excludeId = null) {
        return users.some(user => {
            if (excludeId && user.id === excludeId) return false; // Ignora o usuário que está sendo editado
            return user.email === email || user.phone === phone;
        });
    }

    // Adiciona ou edita um usuário
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        // Validação básica
        if (!name || !email || !phone) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Verifica se o e-mail ou telefone já existem
        if (isDuplicate(email, phone, editIndex !== null ? users[editIndex].id : null)) {
            alert('E-mail ou telefone já cadastrado. Por favor, use dados únicos.');
            return;
        }

        if (editIndex !== null) {
            // Atualiza o usuário existente

            users[editIndex] = { ...users[editIndex], name, email, phone };
            editIndex = null;
        } else {

            // Adiciona um novo usuário
            const id = nextId++;
            users.push({ id, name, email, phone });
        }

        saveUsers();
        renderUsers();
        userForm.reset();
    });

    // Função para editar um usuário
    window.editUser = (index) => {
        const user = users[index];
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        editIndex = index;
    };

    // Função para excluir um usuário
    window.deleteUser = (index) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            users.splice(index, 1);
            saveUsers();
            renderUsers();
        }
    };

    // Renderiza os usuários ao carregar a página
    renderUsers();
});