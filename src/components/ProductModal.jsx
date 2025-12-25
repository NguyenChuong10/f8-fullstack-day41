import { useState } from "react";
import { useAddProductsMutation, useDeleteProductsMutation, useGetProductsQuery, useUpdateProductsMutation } from "../services/product";
import { useForm } from "react-hook-form"


function ProductModal() {
    //hook
    const [isOpenFormAdd, setIsOpenFormAdd] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    //hook phân trang
    const [currentPage , setCurrentPage] = useState(1);
    const itemsPerPage = 5 ;

    //hook sử lý nhập liệu thêm sửa xoá ,lấy dữ liệu
    const { isLoading, data } = useGetProductsQuery();
    const [createProduct, { isLoading: isCreating, isError, isSuccess, error }] = useAddProductsMutation();
    const [updateProduct, {isLoading: isUpdating}] = useUpdateProductsMutation();
    const [deleteProduct, {isLoading : isDeleting}] = useDeleteProductsMutation();
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue, } = useForm({ defaultValues: { title: "", description: "", category: "sport", price: "", discountPercentage: "", rating: "", stock: "", brand: "", sku: "", weight: "", minimumOrderQuantity: "", thumbnail: "", tags: "", } })

    //event
    const thumbnailPreview = watch("thumbnail");
    console.log(thumbnailPreview)

    // sử lý phân trang
    const allProducts = data?.data?.items || [];
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);

    // ✅ HÀM CHUYỂN TRANG
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll lên đầu
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };



    // mở tắt form tạo sản phẩm
    const handleOpenForm = () => {
        setIsOpenFormAdd(!isOpenFormAdd);
        setEditingProduct(null);
        reset();
    }
    const handleCloseForm = () => {
        setIsOpenFormAdd(false);
        setEditingProduct(null);
        reset();
    }

    const handleOpenFormEdit = (product) => {
        setEditingProduct(product); // Lưu sản phẩm đang sửa
        
        // Điền dữ liệu vào form
        setValue("title", product.title);
        setValue("description", product.description || "");
        setValue("category", product.category);
        setValue("price", product.price);
        setValue("brand", product.brand);
        setValue("sku", product.sku);
        setValue("stock", product.stock || "");
        setValue("weight", product.weight || "");
        setValue("discountPercentage", product.discountPercentage || "");
        setValue("rating", product.rating || "");
        setValue("minimumOrderQuantity", product.minimumOrderQuantity || "");
        setValue("thumbnail", product.thumbnail);
        setValue("tags", Array.isArray(product.tags) ? product.tags.join(", ") : "");
        
        setIsOpenFormAdd(true); // Mở form
    }

    //sử lý form submit gửi dữ liệu và cập nhật dữ liệu
    const onSubmit = async (formData) => {
        try {
            const productData = {
                title: formData.title,
                description: formData.description || "mô tả sản phẩm",
                category: formData.category,
                price: parseFloat(formData.price),
                brand: formData.brand,
                sku: formData.sku,
                thumbnail: formData.thumbnail
            };
            if (formData.stock) productData.stock = parseInt(formData.stock);
            if (formData.weight) productData.weight = parseFloat(formData.weight);
            if (formData.discountPercentage) productData.discountPercentage = parseFloat(formData.discountPercentage);
            if (formData.rating) productData.rating = parseFloat(formData.rating);
            if (formData.minimumOrderQuantity) productData.minimumOrderQuantity = parseInt(formData.minimumOrderQuantity);
            if (formData.tags) productData.tags = formData.tags.split(",").map(tag => tag.trim());


            if (editingProduct) {
                // Nếu đang sửa
                await updateProduct({ 
                    id: editingProduct.id, 
                    ...productData 
                }).unwrap();
                alert("Cập nhật sản phẩm thành công!");
            } else {
                // Nếu đang thêm mới
                await createProduct(productData).unwrap();
                alert("Thêm sản phẩm thành công!");
            }
            
            handleCloseForm();

        } catch (error) {
            console.log("lỗi khi thêm sản phẩm ", error);
            console.log("Chi tiết lỗi : ", error?.data);
            alert(`Có lỗi xảy ra :  ${error?.data?.message || error?.message || 'không thể thêm sản phẩm '}`)
        }
    }

    //sử lý xoá dữ liệu

    const handleDelete = async (id) => {
        if(window.confirm("bạn có chắc muốn xoá sản phẩm này ?")) {
            try {
                await deleteProduct(id).unwrap();
                alert("xoá sản phẩm thành công")
            } catch (error) {
                console.error("Lỗi khi xoá sản phẩm" , error)
                alert("không xoá được sản phẩm này ")
            }
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Danh sách sản phẩm
                    </h1>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                        onClick={handleOpenForm}
                    >
                        Tạo sản phẩm
                    </button>
                </div>

                {/* Form thêm sản phẩm */}
                {isOpenFormAdd && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full space-y-5 mb-6 p-6 border rounded-lg bg-gray-50"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm sản phẩm mới</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Tên sản phẩm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("title", {
                                        required: "Vui lòng nhập tên sản phẩm",
                                        minLength: {
                                            value: 3,
                                            message: "Tên sản phẩm phải có ít nhất 3 ký tự"
                                        }
                                    })}
                                    placeholder="Nhập tên sản phẩm"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.title ? "border-red-500" : ""
                                        } `}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}

                            </div>

                            {/* Giá sản phẩm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giá sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    {...register("price", {
                                        required: "Vui lòng nhập giá sản phẩm",
                                        min: {
                                            value: 0,
                                            message: " giá sản phẩm phải lớn hơn không "
                                        }
                                    })}
                                    step="0.01"
                                    placeholder="Nhập giá"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.price ? "border-red-500" : ""
                                        }  `}
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                )}


                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("category", { required: "Vui lòng chọn danh mục" })}
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.category ? "border-red-500" : ""
                                        }  `} >
                                    <option value="sports">Sports</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home">Home</option>
                                    <option value="electronics">Electronics</option>
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                )}

                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thương hiệu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {
                                    ...register("brand", {
                                        required: "Vui lòng nhập thương hiệu "
                                    }
                                    )
                                    }
                                    placeholder="Nhập thương hiệu"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.brand ? "border-red-500" : ""
                                        }  `}
                                />
                                {errors.brand && (
                                    <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
                                )}
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {
                                    ...register("sku", {
                                        required: "vui lòng nhập mã sku"
                                    })
                                    }
                                    placeholder="Nhập mã SKU"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.sku ? "border-red-500" : ""
                                        }  `}
                                />
                                {errors.sku && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số lượng tồn kho
                                </label>
                                <input
                                    type="number"
                                    {
                                    ...register("stock", {
                                        required: "Mời bạn nhập số lượng"
                                    })
                                    }
                                    placeholder="Nhập số lượng"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none  "
                                />
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trọng lượng (kg)
                                </label>
                                <input
                                    type="number"
                                    {...register("weight")}
                                    step="0.01"
                                    placeholder="Nhập trọng lượng"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giảm giá (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("discountPercentage")}
                                    placeholder="Nhập % giảm giá"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đánh giá (1-5)
                                </label>
                                <input
                                    {
                                        ...register("rating" , {
                                            min:0,
                                            max:5
                                        })
                                    }
                                    type="number"
                                    step="0.1"
                                    placeholder="Nhập đánh giá"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Min Order Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số lượng đặt hàng tối thiểu
                                </label>
                                <input
                                    type="number"
                                    {...register("minimumOrderQuantity"
                                    )}
                                    placeholder="Nhập số lượng"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Tags */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags (phân cách bằng dấu phẩy)
                                </label>
                                <input
                                    type="text"
                                    {...register("tags")}
                                    placeholder="Ví dụ: new, sale, hot"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* URL ảnh sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL ảnh sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                {...register("thumbnail", {
                                    required: "URL ảnh là bắt buộc",
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: "URL phải bắt đầu bằng http:// hoặc https://"
                                    }
                                })}
                                defaultValue="https://picsum.photos/400/400"
                                placeholder="https://example.com/image.jpg"
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.thumbnail ? "border-red-500" : ""
                                    }`}
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Ví dụ: https://picsum.photos/400/400
                            </p>

                            {/* Preview ảnh */}
                            {thumbnailPreview && (
                                <div className="mt-3">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg border"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x200?text=Invalid+URL";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Mô tả sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả sản phẩm
                            </label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                placeholder="Nhập mô tả sản phẩm"
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                onClick={handleCloseForm}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"

                            >
                                {isCreating ? "Đang lưu..." : "Lưu sản phẩm"}
                            </button>
                        </div>

                    </form>
                )}

                {/* Loading */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <svg className="w-10 h-10 animate-spin text-blue-600" viewBox="0 0 100 101" fill="none">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    </div>
                 ) : (
                    /* Grid sản phẩm */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
                            >
                                {/* Hình ảnh */}
                                <div className="h-48 bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Nội dung */}
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                        {product.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-green-600 font-bold text-lg">
                                            {product.price?.toLocaleString()} đ
                                        </span>

                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                            Còn {product.stock}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 px-3 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                                        onClick={() => handleOpenFormEdit(product)}>
                                            {isUpdating ? "Đang sửa" : "sửa"}
                                        </button>
                                        <button className="flex-1 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isDeleting}
                                        >
                                            {isDeleting ? "Đang xoá" : "Xoá"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                    {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                {/* Nút Previous */}
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Trước
                                </button>

                                {/* Số trang */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    
                                    // Chỉ hiển thị 5 trang: trang đầu, cuối và 3 trang gần current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    currentPage === pageNumber
                                                        ? "bg-blue-600 text-white"
                                                        : "border hover:bg-gray-100"
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return <span key={pageNumber}>...</span>;
                                    }
                                    return null;
                                })}

                                {/* Nút Next */}
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau →
                                </button>
                            </div>
                        )}

                        {/* Thông tin trang */}
                        <div className="text-center text-sm text-gray-600 mt-4">
                            Trang {currentPage} / {totalPages} - Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allProducts.length)} trong {allProducts.length} sản phẩm
                        </div>

            </div>
        </div>
    );
}

export default ProductModal;