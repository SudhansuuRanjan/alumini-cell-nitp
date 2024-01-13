import { useState, useEffect } from "react"
import './Gallery.scss'
import { MdClose, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import Heading from "../../components/Headings/Heading"
import { db } from "../../firebase"
import { collection, getDocs } from "firebase/firestore"
import Meta from "../../components/Meta/Meta";
import Loader from "../../components/Loader";

const Gallery = () => {
    const [currentImg, setCurrentImg] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [isError, setIsError] = useState(false);


    const getGallery = async () => {
        try {
            setIsLoading(true);
            const galleryRef = collection(db, "gallery");
            const gallerySnap = await getDocs(galleryRef);
            const data = gallerySnap.docs.map((doc) => doc.data());
            setGallery(data);
        } catch (err) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [modal]);

    useEffect(() => {
        getGallery();
    }, []);


    return (
        <div className="gallery_container">
            <Meta name="Gallery" />
            <Heading heading="PHOTOS" desc="— Our Photo Gallery" />

            <div className="photo-gallery-cont">
                <div className="photo-gallery gap-5">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[10rem] w-full">
                            <Loader />
                        </div>
                    ) : isError ? (
                        <p className="text-center">Error fetching images.</p>
                    ) : (
                        <div className="grid w-full text-center lg:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] md:grid-cols-[minmax(100px,_1fr),minmax(100px,_1fr),minmax(100px,_1fr)] grid-cols-[minmax(100px,_1fr)] gap-6">
                            {gallery.map((img, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="bg-gray-900 bg-opacity-40 rounded-[1rem] cursor-pointer"
                                    >
                                        <img
                                            data-aos="zoom-in"
                                            className="rounded-[1rem]"
                                            height={1080}
                                            width={1920}
                                            loading="lazy"
                                            src={img.img}
                                            alt="gallery-photo"
                                            onClick={() => {
                                                setCurrentImg(index);
                                                setModal(true);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {modal && (
                <div
                    className="slideshow-container transition"
                    onClick={(e) => {
                        handleClose(e);
                    }}
                >
                    <div className="slide">
                        <div className="img-display">
                            <img
                                loading="lazy"
                                src={data[currentImg].img}
                                alt="Slide image"
                            />
                        </div>

                        <div className="controls">
                            <button
                                onClick={() => {
                                    if (currentImg === 0) {
                                        setCurrentImg(data.length - 1);
                                    } else {
                                        setCurrentImg(currentImg - 1);
                                    }
                                }}
                            >
                                <MdKeyboardArrowLeft className="text-white" size={20} />
                            </button>
                            <button onClick={() => setModal(false)}>
                                <MdClose className="text-white" size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    if (currentImg === data.length - 1) {
                                        setCurrentImg(0);
                                    } else {
                                        setCurrentImg(currentImg + 1);
                                    }
                                }}
                            >
                                <MdKeyboardArrowRight className="text-white" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Gallery