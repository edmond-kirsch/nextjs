export default function validateEmail(email, domain) {
    const regex = (domain !== '*' && domain !== '') ? new RegExp(`^[a-z0-9-_\.]+@${domain}$`) : /^[a-z0-9-_\.]+\.[a-z]{2,3}$/i;
    return regex.test(email);
}
