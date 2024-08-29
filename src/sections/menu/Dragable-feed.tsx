import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Reorder } from 'framer-motion';
import { useAppSelector } from "@/redux/store";
import { editItemToCategory, getCategories, updateCategoriesOrder, updateItemsOrder } from '@/redux/api/menu.api';
import Swal from 'sweetalert2'
import { CategoryModel, setCategoryList } from '@/redux/menuSlice';
import { useDispatch } from 'react-redux';
import Login from '@/app/admin/login/page';


export default function DragableFeed() {
    const dispatch = useDispatch();
    const categories = useAppSelector((state) => state.menu);
    const { user, status, error } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    const getCategoryList = async () => {
        const categoryList = await getCategories();
        const transformedCategories: CategoryModel[] = categoryList.map(category => ({
            name: category.name,
            open: category.open,
            id: category.id,
            items: category.items,
        }));
        dispatch(setCategoryList(transformedCategories));
        setIsLoading(false);
    };

    const handleCategoriesReorder = async (newCategories: CategoryModel[]) => {
        dispatch(setCategoryList(newCategories));
        await updateCategoriesOrder(newCategories);
    };

    const handleItemsReorder = async (categoryId: string, newItems: any[]) => {
        const newCategories = categories.map(category => {
            if (category.id === categoryId) {
                return { ...category, items: newItems };
            }
            return category;
        });
        dispatch(setCategoryList(newCategories));
        await updateItemsOrder(categoryId, newItems);
    };

    const handleEditItem = async (categoryId: string, itemID: string, itemName: string, availability: boolean) => {
        const newCategories = categories.map(category => {
            if (category.id === categoryId) {
                const updatedItems = category.items.map(item => {
                    if (item.id === itemID) {
                        return {
                            ...item,
                            'availability': availability
                        };
                    }
                    return item;
                });
                return { ...category, items: updatedItems };
            }
            return category;
        });
        dispatch(setCategoryList(newCategories));
        await editItemToCategory(categoryId, itemID ?? "", 'availability', availability ?? false);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${itemName} item ${availability ? "activated" : "deactivated"} successfully`,
            showConfirmButton: false,
            timer: 1500,
        });
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    return <>
        {
            status == 'loading' ?
                <div></div> :
                user ?
                    <div className="max-w-2xl mx-auto py-16 px-3 flex flex-col items-center">
                        <Link href="/" className="font-semibold cursor-pointer">
                            <img src="/logo/marichcafe.jpeg" alt="Sample Image" className="rounded-full h-32" />
                        </Link>
                        <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden mt-10 w-full">
                            <div className="flex bg-[#D9232A] justify-between items-center px-6 py-4">
                                <div className="text-white text-start">
                                    <h1 className="text-4xl font-semibold font-dancing">Marich Menu</h1>
                                    <p className="text-sm">Marich Menu Admin preview</p>
                                </div>
                                <Link href={'/admin/menu/add-menu'}>
                                    <button className="bg-black text-white font-normal text-sm py-0 px-4 rounded-full h-12">
                                        Add/edit menu
                                    </button>
                                </Link>
                            </div>
                            <div className="py-6 ml-3 mr-6">
                                {isLoading && (
                                    <div role="status" className="flex flex-col items-center">
                                        <svg
                                            aria-hidden="true"
                                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#D3AE49]"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                )}
                                {categories && categories.length > 0 && (
                                    <Reorder.Group axis="y" values={categories} onReorder={handleCategoriesReorder}>
                                        {categories.map((category) =>
                                            category && category.items && category.items.length > 0 ? (
                                                <Reorder.Item key={category.id} value={category}>
                                                    <div>
                                                        <div className="flex items-center mb-4 gap-2">
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                className="w-5 h-5"
                                                                fill="#fff"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g id="Interface / Drag_Vertical">
                                                                    <g id="Vector">
                                                                        <path
                                                                            d="M14 18C14 18.5523 14.4477 19 15 19C15.5523 19 16 18.5523 16 18C16 17.4477 15.5523 17 15 17C14.4477 17 14 17.4477 14 18Z"
                                                                            stroke="#fff"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M8 18C8 18.5523 8.44772 19 9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18Z"
                                                                            stroke="#fff"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M14 12C14 12.5523 14.4477 13 15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12Z"
                                                                            stroke="#fff"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M8 12C8 12.5523 8.44772 13 9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12Z"
                                                                            stroke="#fff"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M14 6C14 6.55228 14.4477 7 15 7C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5C14.4477 5 14 5.44772 14 6Z"
                                                                            stroke="#fff"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M8 6C8 6.55228 8.44772 7 9 7C9.55228 7 10 6.55228 10 6C10 5.44772 9.55228 5 9 5C8.44772 5 8 5.44772 8 6Z"
                                                                            stroke="#fff"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </g>
                                                                </g>
                                                            </svg>
                                                            <h2 className="text-xl font-semibold">{category.name}</h2>
                                                        </div>
                                                        <Reorder.Group
                                                            axis="y"
                                                            values={category.items}
                                                            onReorder={newItems => handleItemsReorder(category.id, newItems)}
                                                        >
                                                            <ul className="mb-8 ml-[9px] pr-[6px]">
                                                                {category.items.map((item) =>
                                                                    item && item.name && item.price ? (
                                                                        <Reorder.Item key={item.id} value={item}>
                                                                            <li className="flex justify-between mb-2">
                                                                                <div className="flex items-center gap-2 justify-between">
                                                                                    <svg
                                                                                        viewBox="0 0 24 24"
                                                                                        className="w-5 h-5"
                                                                                        fill="#fff"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                    >
                                                                                        <g id="Interface / Drag_Vertical">
                                                                                            <g id="Vector">
                                                                                                <path
                                                                                                    d="M14 18C14 18.5523 14.4477 19 15 19C15.5523 19 16 18.5523 16 18C16 17.4477 15.5523 17 15 17C14.4477 17 14 17.4477 14 18Z"
                                                                                                    stroke="#fff"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                />
                                                                                                <path
                                                                                                    d="M8 18C8 18.5523 8.44772 19 9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18Z"
                                                                                                    stroke="#fff"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                />
                                                                                                <path
                                                                                                    d="M14 12C14 12.5523 14.4477 13 15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12Z"
                                                                                                    stroke="#fff"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                />
                                                                                                <path
                                                                                                    d="M8 12C8 12.5523 8.44772 13 9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12Z"
                                                                                                    stroke="#fff"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                />
                                                                                                <path
                                                                                                    d="M14 6C14 6.55228 14.4477 7 15 7C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5C14.4477 5 14 5.44772 14 6Z"
                                                                                                    stroke="#fff"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                />
                                                                                                <path
                                                                                                    d="M8 6C8 6.55228 8.44772 7 9 7C9.55228 7 10 6.55228 10 6C10 5.44772 9.55228 5 9 5C8.44772 5 8 5.44772 8 6Z"
                                                                                                    stroke="#fff"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                />
                                                                                            </g>
                                                                                        </g>
                                                                                    </svg>
                                                                                    <span className="text-sm">{item.name ?? ''}</span>
                                                                                    <label className="inline-flex items-center cursor-pointer">
                                                                                        <input type="checkbox" name="availability" onChange={(e) => handleEditItem(category.id, item.id, item.name, e.target.checked)} className="sr-only peer" checked={item.availability} />
                                                                                        <span></span>
                                                                                        <div className="relative w-7 h-4 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                                                                                    </label>

                                                                                </div>
                                                                                <span className="text-white text-[12px] font-semibold">₹{item.price ?? ''}</span>
                                                                            </li>
                                                                        </Reorder.Item>
                                                                    ) : null
                                                                )}
                                                            </ul>
                                                        </Reorder.Group>
                                                    </div>
                                                </Reorder.Item>
                                            ) : null
                                        )}
                                    </Reorder.Group>
                                )}
                            </div>
                        </div>
                    </div>
                    : <Login />
        }
    </>;
};

