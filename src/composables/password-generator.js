export function generatePassword(length = 12) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialChars = '@$!%*?&';

    const allChars = [lowercase, uppercase, digits, specialChars];
    let password = '';

    // Ensure the password contains at least one of each required character type
    for (const charSet of allChars) {
        password += charSet[Math.floor(Math.random() * charSet.length)];
    }

    // Fill the remaining length with random characters from any set
    for (let i = password.length; i < length; i++) {
        const randomCharSet = allChars[Math.floor(Math.random() * allChars.length)];
        password += randomCharSet[Math.floor(Math.random() * randomCharSet.length)];
    }
    // Shuffle the password to randomize the order
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}
