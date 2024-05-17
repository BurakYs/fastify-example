export default function slugValidation(slug: string) {
    const slugRegex = new RegExp('^[a-zA-Z0-9]+$');
    if (!slugRegex.test(slug)) throw new Error('Invalid slug');

    return true;
}