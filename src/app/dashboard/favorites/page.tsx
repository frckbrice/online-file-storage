import { FilePage } from '@/components/features/dashbord';

export interface IFavoritePageProps {
}

export default function FavoritePage(props: IFavoritePageProps) {
    return (
        <div>
            <FilePage title={"Your Favorites"} favorite={true} />
        </div>
    );
}
