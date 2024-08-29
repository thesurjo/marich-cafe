import { addCategory, addItemToCategory, deleteCategory, deleteItem, editCategory, editItemToCategory, getCategories } from '@/redux/api/menu.api';
import Swal from 'sweetalert2'
import { useAppSelector } from "@/redux/store";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setCategoryList } from '@/redux/menuSlice';
import { useDispatch } from 'react-redux';
import Login from '@/app/admin/login/page';


export default function EditableFeed() {
    const dispatch = useDispatch();
    const categories = useAppSelector((state) => state.menu);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user, status, error } = useAppSelector((state) => state.auth);

    const handleAddCategory = async () => {
        if (newCategoryName.trim() !== '') {
            await addCategory(newCategoryName);
            setNewCategoryName('');
            getCategoryList();
        }
    };

    const handleDeleteCategory = async (categoryID: String, categoryName: String) => {
        const result = await Swal.fire({
            title: `Delete ${categoryName} category?`,
            text: "If you delete this category, all the linked items will also be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#D3AE49",
            confirmButtonText: "Delete"
        });

        if (result.isConfirmed) {
            await deleteCategory(categoryID);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${categoryName} category deleted successfully`,
                showConfirmButton: false,
                timer: 2200,
            });
            getCategoryList();
        }

    };

    const handleDeleteItem = async (categoryID: string, itemID: string, itemName: string) => {
        try {
            const result = await Swal.fire({
                title: `Delete ${itemName} Item?`,
                text: "If you delete this item, it cannot be reverted.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#D3AE49",
                confirmButtonText: "Delete"
            });

            if (result.isConfirmed) {
                await deleteItem(categoryID, itemID);
                const updatedCategories = categories.map(category => {
                    if (category.id === categoryID) {
                        return {
                            ...category,
                            items: category.items.filter(item => item.id !== itemID)
                        };
                    }
                    return category;
                });
                dispatch(setCategoryList(updatedCategories));
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${itemName} item deleted successfully`,
                    showConfirmButton: false,
                    timer: 2200,
                });
            }
        } catch (error) {
            console.error('Error deleting item: ', error);
            // Handle error if necessary
        }
    };


    const getCategoryList = async () => {
        const categoryList = await getCategories();
        dispatch(setCategoryList(categoryList));
        setIsLoading(false)
    };

    const handleAddItem = async (categoryId: string) => {
        const newItem = await addItemToCategory(categoryId, "", "", "", true);
        const updatedCategories = categories.map(category => {
            if (category.id === categoryId) {
                return { ...category, items: [...category.items, newItem] };
            }
            return category;
        });
        dispatch(setCategoryList(updatedCategories));
    };

    const handleEditItem = async (categoryId: string, itemID: string, propertyName: string, propertyValue: any) => {
        const updatedCategories = categories.map((category) => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    items: category.items.map((item) => {
                        if (item.id === itemID) {
                            return { ...item, [propertyName]: propertyValue };
                        }
                        return item;
                    }),
                };
            }
            return category;
        });
        dispatch(setCategoryList(updatedCategories));
        await editItemToCategory(categoryId, itemID, propertyName, propertyValue);
    };

    const handleEditCategory = async (categoryId: String, propertyName: any, propertyValue: any) => {
        const updatedCategories = categories.map(category => {
            if (category.id === categoryId) {
                return { ...category, [propertyName]: propertyValue };
            }
            return category;
        });
        dispatch(setCategoryList(updatedCategories));
        await editCategory(categoryId, propertyName ?? "", propertyValue ?? "",);
    };

    const toggleCategory = (categoryId: String, open: Boolean) => {
        handleEditCategory(categoryId, 'open', !open)
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    return <>
        {
            status == 'loading' ?
                <div></div> :
                user ?
                    <div className="max-w-2xl mx-auto flex flex-col items-center">
                        <Link href="/" className="font-semibold cursor-pointer">
                            <img src="/logo/marichcafe.jpeg"
                                alt="Sample Image" className="rounded-full h-32" />
                        </Link>
                        <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden mt-10 w-full">
                            <div className="flex bg-[#D9232A] justify-between items-center px-6 py-4">
                                <div className="text-white text-start">
                                    <h1 className="text-4xl font-semibold font-dancing">Edit Menu</h1>
                                    <p className="text-sm">Marich Menu Admin add/edit</p>
                                </div>
                                <Link href={'/admin/menu'}>
                                    <button className="bg-black text-white font-normal text-sm py-0 px-4 rounded-full h-12">
                                        Preview Menu
                                    </button>
                                </Link>
                            </div>
                            <div className='py-22 px-6'>
                                <h2 className="text-xl font-bold mb-2 mt-4">Categories</h2>
                                <div className="mb-4 flex flex-col">
                                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Enter category name" className="bg-gray-700 border border-gray-300 text-white text-sm rounded-lg focus:ring-[#D3AE49] focus:border-[#D3AE49] block w-full p-2.5" required />
                                    <button onClick={handleAddCategory} className="w-auto m-auto bg-[#D9232A] text-white px-4 py-2 rounded-md hover:bg-[#D9232A] mt-3">Add Category</button>
                                </div>
                                {
                                    isLoading && <div role="status" className='flex flex-col items-center'>
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#D3AE49]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                }
                                <div className='mt-6'>
                                    {
                                        categories &&
                                        categories.map((category, index) =>
                                            category &&
                                            <div key={category.id} className="mt-6 rounded-lg border-[#D9232A] border-[1px] px-4 py-4">
                                                <div className="flex items-center justify-between">
                                                    <h1 className="text-[#D9232A] font-dancing text-[30px] leading-none">
                                                        {category.name}
                                                    </h1>
                                                    <div className='flex gap-9 items-center'>
                                                        <button onClick={() => handleDeleteCategory(category.id, category.name)} className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">
                                                            <svg className="w-6 h-6 mx-auto" aria-hidden="true" fill="#D9232A" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                                        </button>

                                                        <button onClick={() => toggleCategory(category.id, category.open)} className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">

                                                            {
                                                                category.open ?
                                                                    <svg className="w-4 h-4 mx-auto" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                            <g id="Dribbble-Light-Preview" transform="translate(-260.000000, -6684.000000)" fill="#fff">
                                                                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                                                                    <path d="M223.707692,6534.63378 L223.707692,6534.63378 C224.097436,6534.22888 224.097436,6533.57338 223.707692,6533.16951 L215.444127,6524.60657 C214.66364,6523.79781 213.397472,6523.79781 212.616986,6524.60657 L204.29246,6533.23165 C203.906714,6533.6324 203.901717,6534.27962 204.282467,6534.68555 C204.671211,6535.10081 205.31179,6535.10495 205.70653,6534.69695 L213.323521,6526.80297 C213.714264,6526.39807 214.346848,6526.39807 214.737591,6526.80297 L222.294621,6534.63378 C222.684365,6535.03868 223.317949,6535.03868 223.707692,6534.63378" id="arrow_up-[#337]">
                                                                                    </path>
                                                                                </g>
                                                                            </g>
                                                                        </g>
                                                                    </svg>
                                                                    :
                                                                    <svg className="w-4 h-4 mx-auto" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                        <g id="Page-1" stroke="none" strokeWidth="1" fill="#fff" fillRule="evenodd">
                                                                            <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)" fill="#fff">
                                                                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                                                                    <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]">
                                                                                    </path>
                                                                                </g>
                                                                            </g>
                                                                        </g>
                                                                    </svg>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                                {
                                                    category.open &&
                                                    <div className='mt-1 flex flex-col'>
                                                        <ul className="list-disc">
                                                            {
                                                                category.items && category.items.map((item, itemIndex) => (
                                                                    item &&
                                                                    <div className='mt-6 rounded-lg border-[#D3AE49] border-[1px] px-4 py-4' key={item.id}>
                                                                        <div className='flex gap-3'>
                                                                            <input type="text" defaultValue={item.name} name="name" onChange={(e) => handleEditItem(category.id, item.id, e.target.name, e.target.value)} placeholder="Enter item name" className="bg-gray-700 border border-gray-300 text-white text-sm rounded-lg focus:ring-[#D3AE49] focus:border-[#D3AE49] block w-full p-2.5 mb-3" required />
                                                                            <input type="text" defaultValue={item.price} name="price" onChange={(e) => handleEditItem(category.id, item.id, e.target.name, e.target.value)} placeholder="Enter item price" className="bg-gray-700 border border-gray-300 text-white text-sm rounded-lg focus:ring-[#D3AE49] focus:border-[#D3AE49] block w-full p-2.5 mb-3" required />
                                                                        </div>
                                                                        <textarea defaultValue={item.description} name="description" onChange={(e) => handleEditItem(category.id, item.id, e.target.name, e.target.value)} placeholder="Enter item description" className="bg-gray-700 border border-gray-300 text-white text-sm rounded-lg focus:ring-[#D3AE49] focus:border-[#D3AE49] block w-full p-2.5" required />
                                                                        <div className='flex items-center mt-3 justify-between'>
                                                                            <label className="inline-flex items-center cursor-pointer">
                                                                                <input type="checkbox" name="availability" onChange={(e) => handleEditItem(category.id, item.id, e.target.name, e.target.checked)} className="sr-only peer" checked={item.availability} />
                                                                                <span className="text-sm font-mediumtext-white mr-4">Available</span>
                                                                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                                                                            </label>
                                                                            <button onClick={() => handleDeleteItem(category.id, item.id, item.name)} className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">
                                                                                <svg className="w-6 h-6" aria-hidden="true" fill="#D3AE49" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </ul>
                                                        <button onClick={() => handleAddItem(category.id)} className="w-auto m-auto bg-[#D3AE49] text-white px-4 py-2 rounded-md hover:bg-[#D9232A] mt-3">Add Item</button>
                                                    </div>
                                                }

                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div> : <Login />
        }
    </>;
};

