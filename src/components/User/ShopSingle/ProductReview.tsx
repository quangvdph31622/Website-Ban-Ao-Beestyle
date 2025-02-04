import Image from "next/image";
import {Form} from "antd";

const ProductReviewsTab = () => {
    return (
        <div className="tab-pane fade" id="reviews" role="tabpanel">
            <div className="tab-single review-panel">
                <div className="row">
                    <div className="col-12">
                        <div className="ratting-main">
                            <div className="avg-ratting">
                                <h4>4.5 <span>(Overall)</span></h4>
                                <span>Based on 1 Comments</span>
                            </div>
                            <div className="single-rating">
                                <div className="rating-author">
                                    <Image width={200} height={200} src="https://via.placeholder.com/200x200" alt="#"/>
                                </div>
                                <div className="rating-des">
                                    <h6>Naimur Rahman</h6>
                                    <div className="ratings">
                                        <ul className="rating">
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star-half-o"></i></li>
                                            <li><i className="fa fa-star-o"></i></li>
                                        </ul>
                                        <div className="rate-count">(<span>3.5</span>)</div>
                                    </div>
                                    <p>Duis tincidunt mauris ac aliquet congue. Donec vestibulum consequat cursus.
                                        Aliquam pellentesque nulla dolor, in imperdiet.</p>
                                </div>
                            </div>
                            <div className="single-rating">
                                <div className="rating-author">
                                    <Image width={200} height={200} src="https://via.placeholder.com/200x200" alt="#"/>
                                </div>
                                <div className="rating-des">
                                    <h6>Advin Geri</h6>
                                    <div className="ratings">
                                        <ul className="rating">
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                        </ul>
                                        <div className="rate-count">(<span>5.0</span>)</div>
                                    </div>
                                    <p>Duis tincidunt mauris ac aliquet congue. Donec vestibulum consequat cursus.
                                        Aliquam pellentesque nulla dolor, in imperdiet.</p>
                                </div>
                            </div>
                        </div>
                        <div className="comment-review">
                            <div className="add-review">
                                <h5>Add A Review</h5>
                                <p>Your email address will not be published. Required fields are marked</p>
                            </div>
                            <h4>Your Rating</h4>
                            <div className="review-inner">
                                <div className="ratings">
                                    <ul className="rating">
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Form className="form" method="post" action="">
                            <div className="row">
                                <div className="col-lg-6 col-12">
                                    <div className="form-group">
                                        <label>Your Name<span>*</span></label>
                                        <input type="text" name="name" required="required" placeholder=""/>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="form-group">
                                        <label>Your Email<span>*</span></label>
                                        <input type="email" name="email" required="required" placeholder=""/>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-12">
                                    <div className="form-group">
                                        <label>Write a review<span>*</span></label>
                                        <textarea name="message" rows="6" placeholder=""></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-12">
                                    <div className="form-group button5">
                                        <button type="submit" className="btn">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviewsTab;
