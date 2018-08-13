import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { css, StyleSheet } from 'aphrodite/no-important';
import Lightbox from 'react-images';
import styled from 'styled-components'
import Img from "gatsby-image";

const Thumbnail = styled.a`
  display: block;
  padding-right: 2px;
  padding-bottom: 2px;

  img {
    width: 100%;
  }
  
`

const GalleryDiv = styled.div`
  column-count: 1;
  column-gap: 0;
  max-width: 1360px;
  margin: 0 auto;
  
  @media screen and (min-width: 400px) {
    column-count: 2;
  }
  
  @media screen and (min-width: 800px) {
    column-count: 3;
  }
  
  @media screen and (min-width: 1400px) {
    column-count: 4;
  }
`

const Image = styled.div`
  border: 4px solid transparent;
  break-inside: avoid;
  position: relative;
  cursor: pointer;

  @media screen and (min-width: 400px) {
    border-width: 1px;
  }

  @media screen and (min-width: 800px) {
    border-width: 1px;
  }
  @media screen and (min-width: 1000px) {
    border-width: 2px;
  }

  & img {
    border-radius: 2px;
  }

  & .gatsby-image-wrapper:hover {
    & div + img {
      opacity: 1 !important;
    }
    & img + img {
      opacity: 0 !important;
    }
    & span {
      opacity: 1 !important;
    }
  }
`
class Gallery extends Component {
	constructor () {
		super();

		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
		};

		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.gotoImage = this.gotoImage.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
	}
	openLightbox (index, event) {
		event.preventDefault();
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		});
	}
	closeLightbox () {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		});
	}
	gotoPrevious () {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}
	gotoNext () {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}
	gotoImage (index) {
		this.setState({
			currentImage: index,
		});
	}
	handleClickImage () {
		if (this.state.currentImage === this.props.images.length - 1) return;

		this.gotoNext();
	}
	renderGallery () {
		const { images } = this.props;

    console.log('IMAGES', images)
		if (!images) return;

		const gallery = images.map((obj, i) => {
			return (
				<Thumbnail
					href={obj.src}
					// className={css(classes.thumbnail, classes[obj.orientation])}
					key={i}
					onClick={(e) => this.openLightbox(i, e)}
				>
					{/* <Img resolutions={obj.resolutions}/> */}
          <img src={obj.src}/>
				</Thumbnail>
			);
		});

		return (
			<GalleryDiv>
        {images.map((obj, index) => (
          <Image 
            key={index}
            onClick={(e) => this.openLightbox(index, e)}
          >
            <Img fluid={obj.fluid} />
          </Image>
        ))}
      </GalleryDiv>
		);
	}
	render () {
		return (
			<div className="section">
				{this.props.heading && <h2>{this.props.heading}</h2>}
				{this.props.subheading && <p>{this.props.subheading}</p>}
				{this.renderGallery()}
				<Lightbox
					currentImage={this.state.currentImage}
					images={this.props.images}
					isOpen={this.state.lightboxIsOpen}
					onClickImage={this.handleClickImage}
					onClickNext={this.gotoNext}
					onClickPrev={this.gotoPrevious}
					onClickThumbnail={this.gotoImage}
					onClose={this.closeLightbox}
					preventScroll={this.props.preventScroll}
					showThumbnails={this.props.showThumbnails}
					spinner={this.props.spinner}
					spinnerColor={this.props.spinnerColor}
					spinnerSize={this.props.spinnerSize}
					theme={this.props.theme}
				/>
			</div>
		);
	}
}

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
	heading: PropTypes.string,
	images: PropTypes.array,
	showThumbnails: PropTypes.bool,
	subheading: PropTypes.string,
};

const gutter = {
	small: 2,
	large: 4,
};
// const classes = StyleSheet.create({
// 	gallery: {
// 		marginRight: -gutter.small,
// 		overflow: 'hidden',

// 		'@media (min-width: 500px)': {
// 			marginRight: -gutter.large,
// 		},
// 	},

// 	// anchor
// 	thumbnail: {
// 		boxSizing: 'border-box',
// 		display: 'block',
// 		float: 'left',
// 		lineHeight: 0,
// 		paddingRight: gutter.small,
// 		paddingBottom: gutter.small,
// 		overflow: 'hidden',

// 		'@media (min-width: 500px)': {
// 			paddingRight: gutter.large,
// 			paddingBottom: gutter.large,
// 		},
// 	},

// 	// orientation
// 	landscape: {
// 		width: '30%',
// 	},
// 	square: {
// 		paddingBottom: 0,
// 		width: '40%',

// 		'@media (min-width: 500px)': {
// 			paddingBottom: 0,
// 		},
// 	},

// 	// actual <img />
// 	source: {
// 		border: 0,
// 		display: 'block',
// 		height: 'auto',
// 		maxWidth: '100%',
// 		width: 'auto',
// 	},
// });

export default Gallery;