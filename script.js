let training = [];


// ==========================
// Load Training Data
// ==========================


async function loadTraining(){

    try{

        const response = await fetch(
            "http://localhost:3000/api/training"
        );


        training = await response.json();


        displayDashboard();


    } catch(error){

        console.error(
            "Error loading training data:",
            error
        );

    }

}


loadTraining();



// ==========================
// Dashboard Display
// ==========================

function displayDashboard(){


    // Total Sessions

    document.getElementById("sessions").innerHTML =
        training.length;



    // Total Hours

    const totalHours =
        training.reduce(
            (sum, session)=>{

                return sum + 
                (session.duration_minutes / 60);

            },
            0
        );


    document.getElementById("hours").innerHTML =
        totalHours.toFixed(1);



    // Sessions This Month

    const currentMonth =
        new Date().getMonth() + 1;



    const monthSessions =
        training.filter(session=>{


            return new Date(
                session.training_date
            )
            .getMonth()+1 === currentMonth;


        }).length;



    document.getElementById("month").innerHTML =
        monthSessions;



    // Unique Martial Arts

    const uniqueStyles =
        [
            ...new Set(
                training.map(
                    session=>session.martial_art
                )
            )
        ];



    document.getElementById("styles").innerHTML =
        uniqueStyles.length;



    createTrainingTable();

    createPieChart();

    createBarChart();


}



// ==========================
// Training Table
// ==========================

function createTrainingTable(){


    const table =
        document.getElementById(
            "trainingTable"
        );


    table.innerHTML = "";



    training.forEach(session=>{


        table.innerHTML += `

        <tr>

            <td>
                ${session.training_date}
            </td>

            <td>
                ${session.martial_art}
            </td>

            <td>
                ${(session.duration_minutes / 60).toFixed(1)}
            </td>

        </tr>

        `;


    });


}




// ==========================
// Pie Chart
// ==========================

function createPieChart(){


    const counts = {};



    training.forEach(session=>{


        const style =
            session.martial_art;



        counts[style] =
            (counts[style] || 0) + 1;


    });



    new Chart(
        document.getElementById(
            "pieChart"
        ),
        {

        type:"pie",

        data:{

            labels:
                Object.keys(counts),


            datasets:[{

                data:
                    Object.values(counts)

            }]

        }

    });


}





// ==========================
// Monthly Bar Chart
// ==========================

function createBarChart(){


    const monthly = {};



    training.forEach(session=>{


        const date =
            new Date(
                session.training_date
            );



        const month =
            date.toLocaleString(
                "default",
                {
                    month:"short"
                }
            );



        monthly[month] =
            (monthly[month] || 0) + 1;


    });



    new Chart(
        document.getElementById(
            "barChart"
        ),
        {


        type:"bar",


        data:{


            labels:
                Object.keys(monthly),


            datasets:[{


                label:
                    "Training Sessions",


                data:
                    Object.values(monthly),


                barPercentage:
                    0.45,


                categoryPercentage:
                    0.55,


                borderRadius:
                    6


            }]


        },


        options:{


            responsive:true,


            plugins:{


                legend:{

                    display:false

                }


            },


            scales:{


                y:{


                    beginAtZero:true,


                    ticks:{


                        stepSize:1,


                        precision:0


                    }


                }


            }


        }


    });


}





// ==========================
// Submit Journal Entry
// ==========================

document
.getElementById("journalForm")
.addEventListener(
"submit",
async function(e){


    e.preventDefault();



    const journalEntry = {


        martial_art:

            document
            .getElementById("martialArt")
            .value,



        duration_minutes:

            90,



        notes:

            document
            .getElementById("journalNotes")
            .value


    };


console.log("Sending data:", journalEntry);
    try{


        const response =
            await fetch(
            "http://localhost:3000/api/training",
            {


            method:"POST",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:
                JSON.stringify(
                    journalEntry
                )


            });



            if (!response.ok){

                throw new Error(
                    "Failed to save training"
                );
            
            }
            
            
            const result =
                await response.json();



        console.log(
            "Saved:",
            result
        );



        alert(
            "Training session saved!"
        );



        location.reload();



    }
    catch(error){


        console.error(
            "Error saving training:",
            error
        );


    }


});