import React from "react"
import Navbar from "./components/Navbar"
import './App.css'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const App = () => {

    const isLoggedIn = useSelector(state => state.isLoggedIn)
    console.log(isLoggedIn)

    const navigate = useNavigate()

    function explorePdt(e){
        navigate('/register')
    }

    return <div className="App">
        <div className="page-ctn">
            <div className="home-section">
                <Navbar />
                <header className="hero-ctn">
                    <h1 className="main-heading">
                        Growing Smarter Harvesting Success
                    </h1>
                    <p className="main-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui error voluptatum debitis necessitatibus maxime inventore ipsa, ipsum nesciunt asperiores minima eum? Id numquam enim incidunt!
                    </p>
                    <button className="cta-btn" onClick={(e) => explorePdt(e)}>Explore our Product</button>
                </header>
            </div>
            <main>
                <section id="our-product">
                    <h2 className="section-heading">What is Our Product?</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro praesentium odio eius, illum repellat delectus maiores veritatis. Esse dolore quis qui porro veniam corrupti adipisci distinctio, eius inventore laudantium incidunt et velit quo iste laboriosam unde blanditiis error amet pariatur. Fugit dignissimos, quia quidem quasi molestiae blanditiis! Necessitatibus nostrum explicabo perspiciatis eaque? Autem unde necessitatibus eum iure? Veniam voluptatibus tenetur nisi iusto earum aliquid repudiandae dolores debitis voluptate soluta magnam exercitationem doloribus inventore adipisci, eveniet, tempora, fugit ducimus animi? Sequi veritatis quam rerum quod, illo, in itaque sint vitae voluptatum fugit amet. Aperiam amet quos sint eligendi cumque animi explicabo!</p>
                </section>

                <section id="product-features">
                    <h2 className="section-heading">Product Features</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro praesentium odio eius, illum repellat delectus maiores veritatis. Esse dolore quis qui porro veniam corrupti adipisci distinctio, eius inventore laudantium incidunt et velit quo iste laboriosam unde blanditiis error amet pariatur. Fugit dignissimos, quia quidem quasi molestiae blanditiis! Necessitatibus nostrum explicabo perspiciatis eaque? Autem unde necessitatibus eum iure? Veniam voluptatibus tenetur nisi iusto earum aliquid repudiandae dolores debitis voluptate soluta magnam exercitationem doloribus inventore adipisci, eveniet, tempora, fugit ducimus animi? Sequi veritatis quam rerum quod, illo, in itaque sint vitae voluptatum fugit amet. Aperiam amet quos sint eligendi cumque animi explicabo!</p>
                </section>

                <section id="about-us">
                    <h2 className="section-heading">About us</h2>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis id eum nesciunt illo incidunt temporibus non perspiciatis neque inventore totam! Blanditiis, necessitatibus aliquid inventore voluptates tenetur magnam doloribus? Eius sint distinctio autem atque hic quaerat eaque perferendis magni, sunt, sequi, non placeat iusto laboriosam tempore dicta optio veritatis assumenda molestias. Maiores vitae distinctio, beatae quibusdam delectus excepturi quos tempore veritatis nihil sequi reprehenderit rem possimus eaque ab quis aut harum. Officiis necessitatibus tenetur similique quasi.</p>
                </section>

                <section id="contact-us">
                    <h2 className="section-heading">Contact us</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae et adipisci maiores corporis similique optio delectus, minus vitae. Est placeat aut provident, ullam voluptatum obcaecati eveniet similique impedit quisquam itaque ratione modi suscipit distinctio earum possimus sit atque saepe? Ipsum, optio nulla. Tempore, velit blanditiis eum magni reprehenderit, illo non quisquam praesentium illum assumenda, voluptates error officiis eveniet beatae delectus earum accusantium doloribus! Dolorem maxime vitae molestiae inventore fugit mollitia natus temporibus debitis quasi culpa?</p>

                    <div className="container">
                        <form id="contact-us-form">
                            <div className="name_email-ctn">
                                <div>
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" placeholder="Enter your name" required />
                                </div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" placeholder="Enter your email" required />
                                </div>
                            </div>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" placeholder="Enter your message" required></textarea>
                            <input type="submit" value="Send" />
                        </form>
                    </div>
                </section>
            </main>

            <footer> 
                <p className="logo">PrecisionAgri</p>
                <p>@Copyright All rights reserved</p>
            </footer>
        </div>
    </div>
}

export default App;