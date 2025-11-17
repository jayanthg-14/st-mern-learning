let students = [
{
  id: "S1",
  name: "Asha",
  completed: ["CS101"], // course ids already passed
  walletBalance: 1500,  // number
  scholarshipPct: 20    // number 0..100
},
{
  id: "S2",
  name: "Jayanth",
  completed: ["CS101"], // course ids already passed
  walletBalance: 1500,  // number
  scholarshipPct: 20    // number 0..100
},
{
  id: "S3",
  name: "Vincent",
  completed: ["CS101"], // course ids already passed
  walletBalance: 1200,  // number
  scholarshipPct: 20    // number 0..100
},
{
  id: "S4",
  name: "Shalini",
  completed: ["CS101"], // course ids already passed
  walletBalance: 1500,  // number
  scholarshipPct: 15    // number 0..100
},

]


let courses = [
  {
  id: "CS101",
  title: "Intro to HTML",
  capacity: 2,
  prerequisites: [] // array of course ids
},
  {
  id: "CS102",
  title: "CSS",
  capacity: 1,
  prerequisites: [] // array of course ids
},
  {
  id: "CS103",
  title: "JS",
  capacity: 1,
  prerequisites: ["CS101"] // array of course ids
},


  {
  id: "CS104",
  title: "REACT",
  capacity: 2,
  prerequisites: [] // array of course ids
}
]


let state = {
  enrollments: [ { studentId: "S1", courseId: "CS201" } ],
  waitlists: { CS102: ["S3",  "S4"] }, // map courseId -> array of studentIds
  ledger: [ { type: "ENROLL_OK", meta: { studentId: "S1", courseId: "CS201", fee: 630 } } ]
  }


function findStudent(students, studentId){
    for(let element of students){
        if (element.id == studentId){
          let student = {...element};
          return student;
        }
    }
    return null;
}

function findCourse(courses, courseId){
    for(let element of courses){
        if (element.id == courseId){
          let course = {...element};
          return course;
        }
    }
    return null;
}

function hasPrerequisites(student, course){
  return course.prerequisites.every((element)=>{
    return student.completed.includes(element);
  })
}

function seatsRemaining(courseId, state, courses){
  let capacity = 0;
  for(let course of courses){ // find capacity
    if(course.id == courseId){

      capacity = course.capacity;
      break;
    }
  }


  let currentEnrolledCount = 0;
  state.enrollments.forEach(element => {
      if(element.courseId == courseId){
        currentEnrolledCount++;
      }
  });

  return capacity-currentEnrolledCount;  

}

function placeOnWaitlist(state, courseId, studentId){
  let updatedState = {...state};
  for(let i in updatedState.waitlists){
    if(i == courseId)
    {
      updatedState.waitlists[i].push(studentId);
      return updatedState;
    }
  }
}

function promoteFromWaitlist(state, courseId){
  let promotedStudentId = null;
  let updatedState = {...state};
  for(let i in updatedState.waitlists){
    if(i == courseId && i.length)
    { 
      promotedStudentId = updatedState.waitlists[i].shift();

      return {
        state: updatedState,
        promotedStudentId
      }
    }
  }
  return{
        state,
        promotedStudentId
  }
}

function computeTuition(billing, student){
  let scholarshipPct = student.scholarshipPct;

  return (nCourses)=>{
    let base = billing.feePerCourse * nCourses * (1- scholarshipPct/100);
    let total = base * (1+ billing.taxPct/100);
    return total;
  }
}

function processPayment(student, amount){
  if (student.walletBalance >= amount){
    return { ok: true, 
              student: { ...student, walletBalance: student.walletBalance - amount } }
  }
  return { ok: false, student };
}

function enroll(state, studentId, courseId){
  let updatedState = {...state};
  updatedState.enrollments.push({
    studentId, 
    courseId
  })

  return updatedState;
}

function log(state, event){
  let updatedState = {...state};
  updatedState.ledger.push(event);
  return updatedState;
}

function applyRequest(state, students, courses, billing, request)
{
  let studentId = request.studentId;
  let courseId = request.courseId;
  let student = findStudent(students, studentId);
  let course = findCourse(courses, courseId);

  if(!student || !course){
    let event = { 
      type: "REQUEST_INVALID", meta: { studentId: request.studentId, courseId: request.courseId, fee: null} } 
      
    let updatedState = log(state, event)
    return {
      updatedState, students

    };
  }

  let prerequisitesMatched = hasPrerequisites(student, course)
  if(!prerequisitesMatched){
    let updatedState = placeOnWaitlist(state, courseId, studentId);
    let event = { 
                     type: "WAITLIST_PREREQ", meta: { studentId: studentId, courseId: courseId, fee: null} } 
      
    updatedState = log(updatedState, event)
    return {
      state: updatedState,
      students
    }
  }

  let seats =  seatsRemaining(courseId, state, courses)
  if(!seats){
      let updatedState = placeOnWaitlist(state, courseId, studentId);
      let event = { 
                     type: "WAITLIST_FULL", meta: { studentId: studentId, courseId: courseId, fee: null} } 
      
    updatedState = log(updatedState, event)
    return {
      state: updatedState,
      students
    }
  }

  let computationFunc = computeTuition(billing, student);
  let amount = computationFunc(1);
  let payment = processPayment(student, amount);
  if(!payment.ok){
    let updatedState = placeOnWaitlist(state, courseId, studentId);
      let event = { 
                     type: "WAITLIST_FUNDS", meta: { studentId: studentId, courseId: courseId, fee: amount} } 
      
    updatedState = log(updatedState, event)
    return {
      state: updatedState,
      students
    }
  }

  for(let i of students){
    if(i.id == studentId){
      i.walletBalance = payment.student.walletBalance;
    }
  }
    let event = { type: "ENROLL_OK", meta: { studentId: studentId, courseId: courseId, fee: amount} } 
      
    let updatedState = log(state, event)



  return {
    updatedState, students 
  }
}

function runRegistration(state, students, courses, billing, batch){
  batch.forEach((request) => {
    applyRequest(state, students,courses, billing, request);
  });

  for( let i in state.waitlists){
    let seats = seatsRemaining(i, state, courses)
    
    while(seatsRemaining(i, state, courses) && state.waitlists[i].length){
      let studentId = state.waitlists[i].shift();
      let courseId = i;
      let student = findStudent(students,studentId);
      let computeFunc = computeTuition(billing, student);
      let amount = computeFunc(1);
      let payment = processPayment(student, amount);
      if(!payment.ok){
      let event = { 
                     type: "PROMOTION_FAIL_FUNDS", meta: { studentId: studentId, courseId: courseId, fee: amount} } 
      
      updatedState = log(updatedState, event)
      return {updatedState, students}
      }
      let updatedState = enroll(state, studentId, courseId);
      let event = { 
                     type: "PROMOTION_OK", meta: { studentId: studentId, courseId: courseId, fee: amount} } 
      updatedState = log(updatedState, event)

    }
  }
  
}

const batch = [
  { studentId: "S1", courseId: "CS201" },
  { studentId: "S2", courseId: "CS101" },
  { studentId: "S3", courseId: "CS201" }
];

let billing = {
   feePerCourse: 1000 , taxPct: 2 
}


runRegistration(state, students, courses, billing, batch)

