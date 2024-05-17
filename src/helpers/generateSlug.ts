export default function generateSlug(length: number = 8): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';

    for (let i = 0; i < length; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return slug;
}