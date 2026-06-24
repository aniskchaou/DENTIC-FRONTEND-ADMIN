// Add getSystemSettings function for SystemSettings seeding
exports.getSystemSettings = () => {
    return {
        appName: 'Dentic',
        version: '1.0.0',
        maintenance: false,
        supportEmail: 'support@dentic.fr',
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

const fs = require('fs');

exports.userSeeds = [
    {
        username: 'admin',
        password: 'admin',
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        phone: '1234567890',
        profilePicture: 'https://example.com/admin.jpg',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'staffuser',
        password: 'staffpass',
        fullName: 'Staff User',
        email: 'staff@example.com',
        role: 'STAFF',
        phone: '1234567891',
        profilePicture: 'https://example.com/staff.jpg',
        dateOfBirth: new Date('1990-02-02'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'doctoruser',
        password: 'doctorpass',
        fullName: 'Doctor User',
        email: 'doctor@example.com',
        role: 'DOCTOR',
        phone: '1234567892',
        profilePicture: 'https://example.com/doctor.jpg',
        dateOfBirth: new Date('1985-03-03'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'accountantuser',
        password: 'accountantpass',
        fullName: 'Accountant User',
        email: 'accountant@example.com',
        role: 'ACCOUNTANT',
        phone: '1234567893',
        profilePicture: 'https://example.com/accountant.jpg',
        dateOfBirth: new Date('1992-04-04'),
        gender: 'Female',
        status: 'Active',
    }
        ,
        {
            username: 'technicaluser',
            password: 'technicalpass',
            fullName: 'Technical User',
            email: 'technical@example.com',
            role: 'TECHNICAL',
            phone: '1234567894',
            profilePicture: 'https://example.com/technical.jpg',
            dateOfBirth: new Date('1993-05-05'),
            gender: 'Male',
            status: 'Active',
        }
];


exports.serviceSeed = [{
    name: 'Popular Use Of The Internet',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's1.jpg'

},
{
    name: 'Protective Preventative',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's2.jpg'

},
{
    name: 'Download Free Songs',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's3.jpg'

},
{
    name: 'A Discount Toner Cartridge',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's4.jpg'

}]

exports.expenseSeed = {
    nameexpense: '',
    amount: 0,
    datee: new Date(1980, 6, 20),
    note: 'a'
}

exports.patientSeed = {
    namepatient: 'a',
    emailpatient: 'a',
    birth: new Date(1980, 6, 20),
    telephone: 'a',
    gender: 'a',
    address: 'a'
}


exports.servicePageSeed = {
    title: 'Services',
    subtitle: 'What we Offer to our Customers',
    intro: 'Who are in extremely love with eco friendly system.'
}

exports.schedulePageSeed = {
    title: 'Opening Hours',
    subtitle: 'Get ready to cast your vote and select the right one',
    intro: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}

const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPasswordSync(password) {
  return bcrypt.hashSync(password, saltRounds);
}

exports.userSeeds = [
    {
        username: 'admin',
        password: hashPasswordSync('admin'),
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        phone: '1234567890',
        profilePicture: 'https://example.com/admin.jpg',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'staffuser',
        password: hashPasswordSync('staffpass'),
        fullName: 'Staff User',
        email: 'staff@example.com',
        role: 'STAFF',
        phone: '1234567891',
        profilePicture: 'https://example.com/staff.jpg',
        dateOfBirth: new Date('1990-02-02'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'doctoruser',
        password: hashPasswordSync('doctorpass'),
        fullName: 'Doctor User',
        email: 'doctor@example.com',
        role: 'DOCTOR',
        phone: '1234567892',
        profilePicture: 'https://example.com/doctor.jpg',
        dateOfBirth: new Date('1985-03-03'),
        gender: 'Male',
        status: 'Active',
    },
    // ...other users
];


exports.getEmailTemplateSettings = () => {
    var rawdata = fs.readFileSync('db/settings/email_template.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}


exports.getEmailSettings = () => {
    var rawdata = fs.readFileSync('db/settings/email.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getFooterSettings = () => {
    var rawdata = fs.readFileSync('db/settings/footer.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getHeaderSettings = () => {
    var rawdata = fs.readFileSync('db/settings/header.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getLocalisationSettings = () => {
    var rawdata = fs.readFileSync('db/settings/localisation.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getNotificationSettings = () => {
    var rawdata = fs.readFileSync('db/settings/notification.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getDashboardSettings = () => {
    var rawdata = fs.readFileSync('db/settings/dashboard.json');
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}