const Counter = {
    data() {
        return {
            totalTasques: 0,
            totalTasquesCompletades: 0,
            llistaTasques: [],
            filtre: "",
            opcionsFiltre: [
                { id: 1, nom: "" },
                { id: 2, nom: "Actives" },
                { id: 3, nom: "Completades" },
                { id: 4, nom: "Totes" }
            ],
            filtreText: ""
        }
    },
    mounted() {
        if (localStorage.llistaTasques) this.llistaTasques = JSON.parse(localStorage.llistaTasques);
    },
    methods: {
        formatejarDates(dataTasca) {
            let f = new Date(dataTasca);
            if (dataTasca.includes("Z")) { // CONTÉ ZONA HORARIA, RESTAR-LI LA FRANJA HORARIA
                f = new Date(new Date(dataTasca).getTime() - Math.abs(new Date(dataTasca).getTimezoneOffset() * 60));
            }

            let stringData = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
            stringData += " - " + f.getHours() + ":" + ((f.getMinutes() < 10) ? "0" : "") + f.getMinutes() + ":" + ((f.getSeconds() < 10) ? "0" : "") + f.getSeconds();

            return stringData;
        },
        filtrarLlistat() {
            // PER A FILTRAR EL LLISTAT ENS BASAREM EN EL LOCALSTORAGE AIXÍ CREAREM UN NOU VECTOR (VALORS) A MOSTRAR.
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            if (this.filtre === 1 || this.filtre === 4) return this.llistaTasques = arrLlista;

            let filtrat = (this.filtre === 2) ? false : true; // respecte a les completades

            return this.llistaTasques = arrLlista.filter(function(a) { if (a.completada == filtrat) return true; });
        },
        eliminarCompletades() {
            // PER A EL·LIMINAR AGAFAREM EL QUE TENIM EN EL LOCALSTORAGE I EL REFAREM SENSE LES COMPLETADES.
            // ES IGUAL QUE EL FILTRAT L'UNIC CANVI ES QUE A PART DE GUARDAR EN LA VARIABLE O GUARDAREM AL LOCALSTORAGE
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            let novaLLista = arrLlista.filter(function(a) { if (!a.completada) return true; });

            this.llistaTasques = novaLLista;
            localStorage.llistaTasques = JSON.stringify(novaLLista);
        },
        filtrarTasquesDescripcio() {
            // PER A FILTRAR PER TEXT UTILITZAREM CON ABANS EL LOCALSTORAGE I DE AHI CONFORMAREM EL NOU LLISTAT 
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            let filtre = this.filtreText;
            let novaLLista = arrLlista.filter(function(a) { if (a.descripcio.includes(filtre)) return true; });

            this.llistaTasques = novaLLista;
        }
    }
}


window.onload = () => {
    Vue.createApp(Counter).mount("#app");
}