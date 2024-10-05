export default function randomString(length: number = 8): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}
