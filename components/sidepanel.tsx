import { faArrowDown, faArrowUp, faCamera, faRotate, faSave, faTrash, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/react";
import { ScrollToEndIcon, SoftWrapIcon } from "./icons";
import { useState } from "react";

export const SidePanel = () => {

    const [softWrap, setSoftWrap] = useState(false);
    const [scrollToEnd, setScrollToEnd] = useState(false);

    const handleScrollToEnd = () => {
        setScrollToEnd(!scrollToEnd);
    }

    const handleSoftWrap = () => {
        setSoftWrap(!softWrap);
    }


    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto mx-2 flex-shrink-0 [&>button]:flex-shrink-0">
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0" >
                <FontAwesomeIcon
                    icon={faRotate}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0">
                <FontAwesomeIcon
                    icon={faArrowUp}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0">
                <FontAwesomeIcon
                    icon={faArrowDown}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" color={softWrap ? "primary" : "default"} onPress={handleSoftWrap} className="flex-shrink-0">
                <SoftWrapIcon />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" color={scrollToEnd ? "primary" : "default"} onPress={handleScrollToEnd} className="flex-shrink-0">
                <ScrollToEndIcon />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0">
                <FontAwesomeIcon
                    icon={faTrash}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0">
                <FontAwesomeIcon
                    icon={faCamera}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0">
                <FontAwesomeIcon
                    icon={faVideo}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like" className="flex-shrink-0">
                <FontAwesomeIcon
                    icon={faSave}
                />
            </Button>
        </div>
    );
}

