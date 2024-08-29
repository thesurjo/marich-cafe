import { db } from "../../../config";
import { collection, addDoc, updateDoc, getDocs, getDoc, deleteDoc, doc, writeBatch, query, orderBy } from "firebase/firestore";
import { CategoryModel } from "../menuSlice";




export const addCategory = async (categoryName: String) => {
    try {
        const categoryRef = await addDoc(collection(db, "categories"), {
            name: categoryName,
            open: true,
            order: 0
        });
        return categoryRef.id;
    } catch (error) {
        console.error('Error adding category: ', error);
        throw new Error('Error adding category');
    }
};

export const getCategories = async () => {
    try {
        // Reference to the categories collection with an orderBy clause
        const categoriesCollectionRef = collection(db, 'categories');
        const categoriesQuery = query(categoriesCollectionRef, orderBy('order'));

        // Get the categories documents
        const querySnapshot = await getDocs(categoriesQuery);

        // Fetch each category along with its items
        const categories = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const categoryData = doc.data();
            const itemsCollectionRef = collection(doc.ref, 'items');
            const itemsSnapshot = await getDocs(itemsCollectionRef);

            // Extract items and assign a default order of 0 if not defined
            const items = itemsSnapshot.docs.map(itemDoc => {
                const itemData = itemDoc.data();
                return {
                    id: itemDoc.id,
                    name: itemData.name !== undefined ? itemData.name : '',
                    description: itemData.description !== undefined ? itemData.description : '',
                    price: itemData.price !== undefined ? itemData.price : 0,
                    availability: itemData.availability !== undefined ? itemData.availability : false,
                    order: itemData.order !== undefined ? itemData.order : 0,
                    ...itemData
                };
            });

            // Sort items by the order field
            items.sort((a, b) => a.order - b.order);

            return {
                id: doc.id,
                open: categoryData.open !== undefined ? categoryData.open : false,
                name: categoryData.name !== undefined ? categoryData.name : '',
                items: items,
                order: categoryData.order !== undefined ? categoryData.order : 0,
                ...categoryData
            };
        }));

        return categories;
    } catch (error) {
        debugger
        console.error('Error getting categories: ', error);
        throw new Error('Error getting categories');
    }
};



export const deleteCategory = async (categoryId: any) => {
    try {
        const categoryDocRef = doc(db, 'categories', categoryId);
        await deleteDoc(categoryDocRef);

        console.log('Category deleted successfully!');
    } catch (error) {

        console.error('Error deleting category: ', error);
        throw new Error('Error deleting category');
    }
};


export const deleteItem = async (categoryId: any, itemId: any) => {
    try {
        const itemDocRef = doc(db, 'categories', categoryId, 'items', itemId);

        await deleteDoc(itemDocRef);

        console.log('Items deleted successfully!');
    } catch (error) {

        console.error('Error deleting item:', error);
        throw new Error('Error deleting item');
    }
};

export const addItemToCategory = async (categoryId: string, itemName: string, itemDescription: string, itemPrice: string, isAvailable: boolean) => {
    try {
        const item = {
            name: itemName,
            description: itemDescription,
            price: itemPrice,
            availability: isAvailable,
            order: 0
        };

        const itemsCollectionRef = collection(db, `categories/${categoryId}/items`);
        const docRef = await addDoc(itemsCollectionRef, item);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                name: itemName,
                description: itemDescription,
                price: itemPrice,
                availability: isAvailable,
                order: 0,
                ...docSnap.data()
            };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding item: ', error);
        throw new Error('Error adding item');
    }
};

export const editItemToCategory = async (categoryId: any, itemId: any, propertyName: any, propertyValue: any) => {
    try {

        const itemRef = doc(db, `categories/${categoryId}/items`, itemId);
        const updatedItem = {
            [propertyName]: propertyValue,
        };

        await updateDoc(itemRef, updatedItem);
        console.log(`Item with ID ${itemId} in category with ID ${categoryId} updated successfully`);
    } catch (error) {
        console.error('Error adding item: ', error);
        throw new Error('Error adding item');
    }
};

export const editCategory = async (categoryId: any, propertyName: any, propertyValue: any,) => {
    try {
        const itemRef = doc(db, `categories`, categoryId);
        const updatedItem = {
            [propertyName]: propertyValue,
        };

        await updateDoc(itemRef, updatedItem);


        console.log(`Category with ID ${categoryId} updated successfully`);
    } catch (error) {
        console.error('Error editing category: ', error);
        throw new Error('Error adding category');
    }
};




export const updateCategoriesOrder = async (categories: CategoryModel[]) => {
    const batch = writeBatch(db);

    categories.forEach((category, index) => {
        const categoryRef = doc(db, 'categories', category.id);

        batch.update(categoryRef, { order: index });
    });

    await batch.commit();
};

interface Item {
    id: string;
    name: string;
    description: string;
    price: string,
    availability: boolean
};

export const updateItemsOrder = async (categoryId: String, items: Item[]) => {
    const batch = writeBatch(db);

    items.forEach((item, index) => {
        const itemRef = doc(db, `categories/${categoryId}/items`, item.id);
        batch.update(itemRef, { order: index });
    });

    await batch.commit();
};