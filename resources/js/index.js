const Counter = {
    data() {
        return {
            totalTasques: 0,
            totalTasquesCompletades: 0,
            filtrat: "",
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
        let tasques = [];
        if (localStorage.llistaTasques) tasques = JSON.parse(localStorage.llistaTasques);
        if (tasques.length == 0) {
            this.llistaTasques = tasques;
            return;
        }

        this.totalTasques = tasques.length;
        this.totalTasquesCompletades = tasques.filter(function(a) { if (a.completada) return true; }).length;

        // CALCULEM LA ORDENACIÓ FILTRAREM PRIMER  PER CADA PRIORITAT I CREAREM UN VECTOR FINAL
        this.reordenarLlistat(tasques);

    },
    methods: {
        reordenarLlistat(llista) {

            let alta = this.filtrarPerPrioritat(llista, "alta");
            let mitja = this.filtrarPerPrioritat(llista, "mitja");
            let baixa = this.filtrarPerPrioritat(llista, "baixa");

            let llistaTasquesOrdenadesPrioritat = [...alta, ...mitja, ...baixa];
            this.llistaTasques = llistaTasquesOrdenadesPrioritat;
        },
        filtrarPerPrioritat(llista, prioritat) {
            return llista.filter(function(a) {
                if (a.prioritat == prioritat) return true;
            });
        },
        formatejarDates(dataTasca) {
            let f = new Date(dataTasca);
            if (dataTasca.includes("Z")) { // CONTÉ ZONA HORARIA, RESTAR-LI LA FRANJA HORARIA
                f = new Date(new Date(dataTasca).getTime() - Math.abs(new Date(dataTasca).getTimezoneOffset() * 60));
            }

            let stringData = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
            stringData += " - " + f.getHours() + ":" + ((f.getMinutes() < 10) ? "0" : "") + f.getMinutes() + ":" + ((f.getSeconds() < 10) ? "0" : "") + f.getSeconds();

            return stringData;
        },
        minutsDesdeInici(dataTasca) {
            let creacioTasca = new Date(dataTasca);
            let dataActual = new Date();
            let diff_milisegons = dataActual.getTime() - creacioTasca.getTime();
            let diff_minuts = diff_milisegons / 1000 / 60;

            return parseInt(diff_minuts) + " min.";
        },
        filtrarLlistat() {
            // PER A FILTRAR EL LLISTAT ENS BASAREM EN EL LOCALSTORAGE AIXÍ CREAREM UN NOU VECTOR (VALORS) A MOSTRAR.
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            if (this.filtre === 1 || this.filtre === 4) {
                this.llistaTasques = arrLlista;
                this.totalTasques = this.llistaTasques.length;
                this.totalTasquesCompletades = this.llistaTasques.filter(function(a) { if (a.completada) return true; }).length;
                this.filtrat = "";
                return;
            }

            let filtrat = (this.filtre === 2) ? false : true; // respecte a les completades

            this.llistaTasques = arrLlista.filter(function(a) { if (a.completada == filtrat) return true; });
            this.totalTasques = this.llistaTasques.length;
            this.totalTasquesCompletades = this.llistaTasques.filter(function(a) { if (a.completada) return true; }).length;
            this.filtrat = " (llista filtrada)";
        },
        eliminarCompletades() {
            // PER A EL·LIMINAR AGAFAREM EL QUE TENIM EN EL LOCALSTORAGE I EL REFAREM SENSE LES COMPLETADES.
            // ES IGUAL QUE EL FILTRAT L'UNIC CANVI ES QUE A PART DE GUARDAR EN LA VARIABLE O GUARDAREM AL LOCALSTORAGE
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            let novaLLista = arrLlista.filter(function(a) { if (!a.completada) return true; });

            this.llistaTasques = novaLLista;
            localStorage.llistaTasques = JSON.stringify(novaLLista);

            this.totalTasques = this.llistaTasques.length;
            this.totalTasquesCompletades = this.llistaTasques.filter(function(a) { if (a.completada) return true; }).length;
        },
        filtrarTasquesDescripcio() {
            // PER A FILTRAR PER TEXT UTILITZAREM CON ABANS EL LOCALSTORAGE I DE AHI CONFORMAREM EL NOU LLISTAT 
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            let filtre = this.filtreText;
            let novaLLista = arrLlista.filter(function(a) { if (a.descripcio.includes(filtre)) return true; });

            this.llistaTasques = novaLLista;
            this.totalTasques = this.llistaTasques.length;
            this.totalTasquesCompletades = this.llistaTasques.filter(function(a) { if (a.completada) return true; }).length;
            this.filtrat = (this.filtreText != "") ? " (llista filtrada)" : "";
        },
        esborrarTasca(id) {
            // PER  ELIMINAR FILTRAREM TOTS ELS QUE NO COINCIDISQUEN AMB EL id QUE ENVIEM. (D'AQUESTA MANERA FEM UN BORRAT SIMULAT)
            let arrLlista = JSON.parse(localStorage.llistaTasques);
            let novaLLista = arrLlista.filter(function(a) { if (a.id != id) return true; });

            this.llistaTasques = novaLLista;
            // GUARDEM EN EL LOCALSTORAGE PER A QUE "GUARDE EL BORRAT"
            localStorage.llistaTasques = JSON.stringify(novaLLista);
            this.totalTasques = this.llistaTasques.length;
            this.totalTasquesCompletades = this.llistaTasques.filter(function(a) { if (a.completada) return true; }).length;
        },
        cambiarPrioritat(id, novaPrioritat) {

            let novaLlista = this.llistaTasques;
            novaLlista.forEach(function(a) {
                if (a.id === id) {
                    a.prioritat = novaPrioritat;
                }
            });

            this.llistaTasques = novaLlista;
            localStorage.llistaTasques = JSON.stringify(novaLlista);
            this.reordenarLlistat(novaLlista);
        },
        canviarEstat(id, completada) {

            let novaLlista = this.llistaTasques;
            novaLlista.forEach(function(a) {
                if (a.id === id) {
                    a.completada = completada;
                }
            });

            this.llistaTasques = novaLlista;
            localStorage.llistaTasques = JSON.stringify(novaLlista);
            this.reordenarLlistat(novaLlista);

            this.totalTasques = this.llistaTasques.length;
            this.totalTasquesCompletades = this.llistaTasques.filter(function(a) { if (a.completada) return true; }).length;
        }
    }
}


window.onload = () => {
    Vue.createApp(Counter).mount("#app");
}