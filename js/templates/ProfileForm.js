export default ({user}) => {
    return `<form id="profileForm" class="w-full" name="profileForm">
                <!-- Displayed: inline on Desktop, Block on mobile -->
                <span class="form-field flex sm-flex-col w-full" style="gap:10px;">
                    <span class="form-field">
                        <label for="firstName">First Name</label>
                        <input type="text" name="firstName" id="firstName" required value="${user.firstName}"/>
                    </span>
                    <span class="form-field">
                        <label for="surname">Surname</label>
                        <input type="text" name="surname" id="surname" required value="${user.surname}"/>
                    </span>
                </span>
                <span class="form-field">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" required value="${user.username}"/>
                </span>
                <button class="bg-primary">Update</button>
            </form>`
}