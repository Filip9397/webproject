document.addEventListener('DOMContentLoaded', function () {
    const registracijaForma = document.querySelector('form');

    registracijaForma.addEventListener('submit', async function (event) {
        event.preventDefault();

        const ime = document.getElementById('ime').value;
        const prezime = document.getElementById('prezime').value;
        const datumRodenja = document.getElementById('datum_rodenja').value;
        const korime = document.getElementById('korime').value;
        const lozinka = document.getElementById('lozinka').value;

        try {
            const odgovor = await fetch('/registracija', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ime,
                    prezime,
                    datum_rodenja: datumRodenja,
                    korime,
                    lozinka
                })
            });

            const rezultat = await odgovor.text();
            alert(rezultat); 
        } catch (error) {
            console.error('Greška prilikom registracije:', error);
        }
    });
});
