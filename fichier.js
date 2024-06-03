// Fonction pour vérifier si la date de naissance est valide
function verifDate(date) {
  var inputDate = new Date(date);
  var currentDate = new Date();

  if (inputDate > currentDate) {
    alert("La date de naissance doit être dans le passé.");
  }
}


// Fonction pour mettre à jour le style d'un champ en fonction de sa validité
function validateField(input) {
  if (input.checkValidity()) {
    input.classList.add("valid");
    input.classList.remove("invalid");
  } else {
    input.classList.add("invalid");
    input.classList.remove("valid");
  }
}



$(document).ready(function () {
  $("#Ajouter-client").click(function () {
    var nom = $("#nom").val();
    var prenom = $("#prenom").val();
    var dateNaissance = $("#date_naissance").val();
    var telephone = $("#telephone").val();
    var email = $("#email").val();
    var enfants = $("#enfants").val();

    
    // Vérification des champs obligatoires
    if (nom === "" || prenom === "" || telephone === ""  || email === "" ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    var contact = {
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      email: email,
      dateNaissance: dateNaissance,
      nombreEnfants: enfants,
    };

    var tableauDeContacts =
      JSON.parse(localStorage.getItem("tableauDeContacts")) || [];
    tableauDeContacts.push(contact);
    localStorage.setItem(
      "tableauDeContacts",
      JSON.stringify(tableauDeContacts)
    );

    construitTable(tableauDeContacts);

    $("#nom, #prenom, #telephone, #email, #date_naissance, #enfants").val("");
  });

  // Appel initial pour restaurer le tableau précédemment sauvegardé
  var tableauDeContacts =
    JSON.parse(localStorage.getItem("tableauDeContacts")) || [];
  construitTable(tableauDeContacts);

  // Fonction d'ajout d'un contact

  function construitTable(tableauDeContacts) {
    const tableBody = $("#tableau-contacts tbody");

    tableBody.empty(); // Efface le contenu précédent du tableau

    tableauDeContacts.forEach(function (contact, index) {
      var row = $("<tr>");
      row.append($("<td>").text(index + 1)); // Index
      row.append(  $("<td>").html( '<img src="./document.png" class="dragIcon" draggable="true" data-index="' +
            index +
            '" style="width: 30px; height: 30px; display: cover; cursor: move;" />'
        )
      ); 

      row.append($("<td>").text(contact.nom)); // Nom
      row.append($("<td>").text(contact.prenom)); // Prénom
      row.append($("<td>").text(contact.telephone)); // Téléphone
      row.append($("<td>").text(contact.email)); // Email
      row.append($("<td>").text(contact.dateNaissance)); // Date de naissance
      row.append($("<td>").text(contact.nombreEnfants)); // Nombre d'enfants
      row.append(
        $("<td>").html(
          '<img src="./delete.jpg" class="deleteIcon" style="width: 30px; height: 30px; display: cover; cursor: pointer;" />'
        )
      ); // Icône de suppression

      tableBody.append(row);
    });

    // Attache un gestionnaire d'événements aux icônes de suppression en fin de ligne
    $(".deleteIcon").click(function () {
      var index = $(this).closest("tr").index();
      SupprimeContact(index);
    });

    // Attache un gestionnaire d'événements aux icônes de glisser-déposer
    $(".dragIcon").on("dragstart", function (event) {
      var index = $(this).data("index");
      event.originalEvent.dataTransfer.setData("text/plain", index);
    });
  }

  // Fonction de suppression d'un contact
  function SupprimeContact(index) {
    var tableauDeContacts = JSON.parse(localStorage.getItem("tableauDeContacts")) || [];

    tableauDeContacts.splice(index, 1); // Supprime le contact du tableau

    localStorage.setItem( "tableauDeContacts",JSON.stringify(tableauDeContacts) );
    construitTable(tableauDeContacts); // Reconstruit le tableau après la suppression
  }

  // Gestionnaire d'événements pour le glisser-déposer sur la poubelle
  $("#poubelle").on("drop", function (event) {
    event.preventDefault();
    var index = event.originalEvent.dataTransfer.getData("text/plain");
    SupprimeContact(index);

    // Ajouter le son de la poubelle après la suppression
    var audio = new Audio("PoubelleSound.mp3");
    audio.play();
  });

  // Empêcher le comportement par défaut pour permettre le glisser-déposer
  $("#poubelle").on("dragover", function (event)
   {
    event.preventDefault();
  });
});
