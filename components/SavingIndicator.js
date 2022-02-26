import { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import styles from './SavingIndicator.module.css';

/** 
 * @class Saving Indicator Component Class
 * @component
 */
class SavingIndicator extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    /**
     * Generates the JSX Output for the Client
     * @returns JSX Output
     */
    render() {

        if (this.props.isSaving && !this.props.isSaved) {
            return (
                <div className={styles.container}>
                    <ClipLoader
                        size={26}
                        color={"#fffff"}
                        loading={true}
                    />
                </div>
            )
        } else if (!this.props.isSaving && this.props.isSaved) {
            return (
                <div className={styles.container}>
                    <p>Saved!</p>
                </div>
            )
        } else {
            return (
                <div className={styles.container}>
                    <p>ERROR</p>
                </div>
            )
        }
    }
}


export default SavingIndicator