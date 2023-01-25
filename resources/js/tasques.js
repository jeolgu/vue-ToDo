const Tasques = {
    data() {
        return {
            llistaPrioritats: ["alta", "mitja", "baixa"],
            descripcio: "",
            prioritat: ""
        }
    },
    methods: {
        afegirTasca() {

            let objError = this.comprovarErrors();
            if (objError.error) return alert(objError.msg_error);

            let tasques = [];
            if (localStorage.llistaTasques) tasques = JSON.parse(localStorage.llistaTasques);

            tasques.push({
                id: (tasques.length + 1),
                descripcio: this.descripcio,
                creacio: new Date(),
                prioritat: this.prioritat,
                completada: false
            });

            localStorage.llistaTasques = JSON.stringify(tasques);

            this.descripcio = "";
            this.prioritat = "";
            alert("Tasca creada amb éxit");
        },
        comprovarErrors() {
            let obj = {
                error: false,
                msg_error: ""
            };

            obj.error = (this.descripcio.trim() != "" && this.prioritat != "") ? false : true;

            if (this.descripcio.trim() == "") obj.msg_error = "La descripció es obligatoria \n";
            if (this.prioritat.trim() == "") obj.msg_error += "La prioritat es obligatoria \n";

            return obj;
        }
    }
}


window.onload = () => {
    Vue.createApp(Tasques).mount("#app");
}