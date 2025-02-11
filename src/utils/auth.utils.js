// This function is used to check if the email domain is personal or not
function CheckEmailDomainIsPersonalOrNotUtil(emailDomain) { // emailDomain is the domain of the email.
    try {
        const PersonalEmailDomainsMap = new Map([ // Map of personal email domains.
            ['gmail.com', 'Gmail'], 
            ['outlook.com', 'Outlook'],
            ['yahoo.com', 'Yahoo'],
            ['protonmail.com', 'ProtonMail'],
            ['icloud.com', 'iCloud'],
            ['zoho.com', 'Zoho'],
            ['aol.com', 'AOL'],
            ['gmx.com', 'GMX'],
            ['gmx.net', 'GMX.net'],
            ['mail.com', 'Mail.com'],
            ['yandex.com', 'Yandex'],
            ['fastmail.com', 'FastMail'],
            ['tutanota.com', 'Tutanota'],
            ['hey.com', 'Hey'],
            ['hushmail.com', 'Hushmail'],
            ['lycos.com', 'Lycos'],
            ['inbox.com', 'Inbox'],
            ['mail.ru', 'Mail.ru'],
            ['rediffmail.com', 'Rediffmail'],
            ['naver.com', 'Naver'], // South Korea
            ['daum.net', 'Daum'], // South Korea
            ['seznam.cz', 'Seznam'], // Czech Republic

            // Disposable / Temporary Email Providers
            ['mailinator.com', 'Mailinator'],
            ['10minutemail.com', '10 Minute Mail'],
            ['guerrillamail.com', 'Guerrilla Mail'],
            ['maildrop.cc', 'Maildrop'],
            ['trashmail.com', 'TrashMail'],
            ['tempmail.com', 'Temp Mail']
        ]);

        if (PersonalEmailDomainsMap.has(emailDomain)) { // Check if the email domain is present in the PersonalEmailDomainsMap.
            return {
                success: true,
                companyName: PersonalEmailDomainsMap.get(emailDomain)
            };
        } else {
            throw new Error(`${emailDomain} is not present in the PersonalEmailDomainsMap`); // Throw error if email domain is not present in the PersonalEmailDomainsMap.
        }
    } catch (err) { // Catch the error and log it.
        console.log(`Error in CheckEmailDomainIsPersonalOrNotUtil with error - ${err}`); // Log the error.
        return {
            success: false
        };
    }
}

module.exports = CheckEmailDomainIsPersonalOrNotUtil;
