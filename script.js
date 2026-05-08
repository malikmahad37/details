const supabaseUrl = 'https://qwgsmeknxrawzrixdjuf.supabase.co';
const supabaseKey = 'sb_publishable_6gCiVxo1ZH0LhAeoVEuygw_vE6weI-7';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('detailsForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Convert files to Base64
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        const userPicFile = document.getElementById('userPic').files[0];
        const idCardPicFile = document.getElementById('idCardPic').files[0];

        if (userPicFile) data.userPic = await toBase64(userPicFile);
        if (idCardPicFile) data.idCardPic = await toBase64(idCardPicFile);

        // Send data to Supabase
        const { error } = await supabaseClient
            .from('candidates')
            .insert([data]);

        if (!error) {
            form.style.opacity = '0';
            form.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                const header = document.querySelector('header');
                if (header) header.classList.add('hidden');
            }, 300);
        } else {
            console.error('Supabase Error:', error);
            alert('کچھ غلط ہو گیا، دوبارہ کوشش کریں۔');
        }
    });

    // Add some interactivity to inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('active');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('active');
            }
        });
    });
});
