'use client';
import BreadcrumbSection from "@/components/Breadcrumb/BreadCrumb";
import ContactForm from "@/components/User/Contact/ContactForm";
import ContactInfo from "@/components/User/Contact/ContactInfo";

const breadcrumbItems = [
    { title: 'Trang chủ', path: '/' },
    { title: 'Liên hệ' },
];

const Contact = () => {
    return (
        <>
            <BreadcrumbSection items={breadcrumbItems} />
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                <ContactForm />
                <ContactInfo />
            </div>
        </>
    )
}

export default Contact;
