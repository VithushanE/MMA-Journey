const training = [

    {
    date:"2026-07-01",
    style:"Muay Thai",
    hours:1.5
    },
    
    {
    date:"2026-07-03",
    style:"BJJ",
    hours:1.5
    },
    
    {
    date:"2026-07-05",
    style:"Muay Thai",
    hours:2
    },
    
    {
    date:"2026-07-08",
    style:"Boxing",
    hours:1
    },
    
    {
    date:"2026-07-10",
    style:"BJJ",
    hours:1.5
    }
    
    ];
    
    // Summary Stats
    
    document.getElementById("sessions").innerHTML = training.length;
    
    const totalHours = training.reduce((a,b)=>a+b.hours,0);
    
    document.getElementById("hours").innerHTML = totalHours;
    
    const currentMonth = new Date().getMonth()+1;
    
    const monthSessions = training.filter(x=>{
    return new Date(x.date).getMonth()+1===currentMonth;
    }).length;
    
    document.getElementById("month").innerHTML = monthSessions;
    
    const uniqueStyles = [...new Set(training.map(x=>x.style))];
    
    document.getElementById("styles").innerHTML = uniqueStyles.length;
    
    // Table
    
    const table=document.getElementById("trainingTable");
    
    training.forEach(x=>{
    
    table.innerHTML +=`
    <tr>
    <td>${x.date}</td>
    <td>${x.style}</td>
    <td>${x.hours}</td>
    </tr>
    `;
    
    });
    
    // Pie Chart
    
    const counts={};
    
    training.forEach(x=>{
    counts[x.style]=(counts[x.style]||0)+1;
    });
    
    new Chart(document.getElementById("pieChart"),{
    
    type:"pie",
    
    data:{
    
    labels:Object.keys(counts),
    
    datasets:[{
    
    data:Object.values(counts)
    
    }]
    
    }
    
    });
    
    // Bar Chart
    
    const monthly={};
    
    training.forEach(x=>{
    
    const month=x.date.substring(0,7);
    
    monthly[month]=(monthly[month]||0)+1;
    
    });
    
    new Chart(document.getElementById("barChart"),{
    
    type:"bar",
    
    data:{
    
    labels:Object.keys(monthly),
    
    datasets:[{
    
    label:"Sessions",
    
    data:Object.values(monthly)
    
    }]
    
    }
    
    });
    
    // Journal
    
    function saveJournal(){
    
    const text=document.getElementById("journalText").value;
    
    localStorage.setItem("journal",text);
    
    loadJournal();
    
    }
    
    function loadJournal(){
    
    document.getElementById("savedEntry").innerHTML=
    localStorage.getItem("journal") || "No journal entry yet.";
    
    }
    
    loadJournal();