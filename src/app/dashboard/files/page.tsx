import { FilePage } from '@/components/features/dashbord';

// enable metadata here
export const metadata = {
    title: 'Files Page',
    description: 'Page to view and manage files.',
};

// Define the component
export default function Page() {
    return <FilePage title={"Your Files"} />
};
